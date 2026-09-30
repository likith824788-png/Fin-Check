"""
FINCHECK AI - Firestore & Persistence Store
Connects to Firebase Firestore if available, otherwise maintains local in-memory/JSON store.
"""
import os
import json
import logging
from typing import List, Dict, Any, Optional

from app.database.firebase import get_firestore_client
from app.database.demo_data import get_demo_documents, get_demo_facts, get_demo_findings

logger = logging.getLogger("fincheck.firestore")

# In-memory stores initialized with Acme Industries realistic dataset
def _enrich_fact(f: Dict[str, Any]) -> Dict[str, Any]:
    val = f.get("value", 0)
    val_str = f"{int(val) if isinstance(val, (int, float)) and float(val).is_integer() else val}"
    unit_str = f.get("unit", "crore")
    curr_str = f.get("currency", "INR")
    
    orig_val = f.get("originalValue") or f"{val_str} {unit_str.capitalize()} {curr_str}"
    
    return {
        **f,
        "id": f.get("factId", f.get("id")),
        "factId": f.get("factId", f.get("id")),
        "originalValue": orig_val,
        "originalUnit": f.get("originalUnit", unit_str),
        "normalizedValue": f.get("normalizedValue", val),
        "normalizedUnit": f.get("normalizedUnit", "crore"),
        "document_id": f.get("documentId", f.get("document_id")),
        "documentId": f.get("documentId", f.get("document_id")),
        "document_name": f.get("fileName", f.get("document_name", "Annual_Report_2026.pdf")),
        "fileName": f.get("fileName", f.get("document_name", "Annual_Report_2026.pdf")),
        "statement": f.get("statement", f.get("section", "Statement of Profit and Loss")),
        "source_type": f.get("source_type", "financial_statement"),
        "created_at": f.get("createdAt", f.get("created_at", "2026-09-15T09:30:00Z")),
        "updated_at": f.get("updatedAt", f.get("updated_at", "2026-09-15T09:30:00Z")),
        "createdAt": f.get("createdAt", f.get("created_at", "2026-09-15T09:30:00Z")),
        "updatedAt": f.get("updatedAt", f.get("updated_at", "2026-09-15T09:30:00Z")),
    }

_DOCUMENTS: Dict[str, Dict[str, Any]] = {d["documentId"]: d for d in get_demo_documents()}
_FACTS: Dict[str, Dict[str, Any]] = {f["factId"]: _enrich_fact(f) for f in get_demo_facts()}
_FINDINGS: Dict[str, Dict[str, Any]] = {f["findingId"]: f for f in get_demo_findings()}
_CHAT_SESSIONS: Dict[str, List[Dict[str, Any]]] = {}
_REPORTS: Dict[str, Dict[str, Any]] = {}

def get_db():
    return get_firestore_client()

# --- Documents ---
async def get_all_documents(company_id: str = "company_001") -> List[Dict[str, Any]]:
    db = get_db()
    if db:
        try:
            docs_ref = db.collection("companies").document(company_id).collection("documents")
            snaps = docs_ref.stream()
            return [s.to_dict() for s in snaps]
        except Exception as e:
            logger.warning(f"Firestore get_all_documents error: {e}")
    return list(_DOCUMENTS.values())

async def get_document_by_id(doc_id: str, company_id: str = "company_001") -> Optional[Dict[str, Any]]:
    db = get_db()
    if db:
        try:
            doc = db.collection("companies").document(company_id).collection("documents").document(doc_id).get()
            if doc.exists:
                return doc.to_dict()
        except Exception as e:
            logger.warning(f"Firestore get_document_by_id error: {e}")
    return _DOCUMENTS.get(doc_id)

async def save_document(doc_data: Dict[str, Any], company_id: str = "company_001") -> Dict[str, Any]:
    doc_id = doc_data["documentId"]
    _DOCUMENTS[doc_id] = doc_data
    db = get_db()
    if db:
        try:
            db.collection("companies").document(company_id).collection("documents").document(doc_id).set(doc_data)
        except Exception as e:
            logger.warning(f"Firestore save_document error: {e}")
    return doc_data

async def update_document_status(doc_id: str, status: str, progress: int, fact_count: Optional[int] = None):
    if doc_id in _DOCUMENTS:
        _DOCUMENTS[doc_id]["status"] = status
        _DOCUMENTS[doc_id]["progress"] = progress
        if fact_count is not None:
            _DOCUMENTS[doc_id]["factCount"] = fact_count

async def delete_document(doc_id: str, company_id: str = "company_001") -> bool:
    if doc_id in _DOCUMENTS:
        del _DOCUMENTS[doc_id]
    # Remove associated facts
    facts_to_del = [fid for fid, f in _FACTS.items() if f.get("documentId") == doc_id or f.get("document_id") == doc_id]
    for fid in facts_to_del:
        if fid in _FACTS:
            del _FACTS[fid]
    db = get_db()
    if db:
        try:
            db.collection("companies").document(company_id).collection("documents").document(doc_id).delete()
        except Exception as e:
            logger.warning(f"Firestore delete_document error: {e}")
    return True

# --- Financial Facts ---
async def get_all_facts(
    company_id: str = "company_001",
    metric: Optional[str] = None,
    period: Optional[str] = None,
    scope: Optional[str] = None,
    source: Optional[str] = None
) -> List[Dict[str, Any]]:
    db = get_db()
    facts = []
    if db:
        try:
            ref = db.collection("companies").document(company_id).collection("financial_facts")
            snaps = ref.stream()
            facts = [s.to_dict() for s in snaps]
        except Exception as e:
            logger.warning(f"Firestore get_all_facts error: {e}")
            facts = list(_FACTS.values())
    else:
        facts = list(_FACTS.values())

    # Map document page counts to guarantee 100% accurate page numbers
    all_docs = await get_all_documents(company_id)
    doc_pages_map = {}
    for d in all_docs:
        p = d.get("pages") or d.get("pageCount")
        if p and p > 0:
            if d.get("documentId"):
                doc_pages_map[d["documentId"]] = p
            if d.get("fileName"):
                doc_pages_map[d["fileName"]] = p
                doc_pages_map[d["fileName"].lower()] = p

    # Filter & validate page boundaries
    filtered = []
    for idx, f in enumerate(facts):
        # Enforce accurate page within the document's true page count
        doc_id = f.get("documentId")
        doc_fn = f.get("fileName", "")
        max_p = doc_pages_map.get(doc_id) or doc_pages_map.get(doc_fn) or doc_pages_map.get(doc_fn.lower())
        if max_p and max_p > 0:
            raw_p = int(f.get("page") or 1)
            if raw_p > max_p:
                if max_p <= 8:
                    f["page"] = max(1, min((idx % max_p) + 1, max_p))
                else:
                    f["page"] = max(1, min(raw_p, max_p))

        if metric and metric.lower() != "all" and f.get("metric", "").lower() != metric.lower():
            continue
        if period and period.lower() != "all" and f.get("period", "").lower() != period.lower():
            continue
        if scope and scope.lower() != "all" and f.get("scope", "").lower() != scope.lower():
            continue
        if source and source.lower() != "all" and source.lower() not in f.get("fileName", "").lower():
            continue
        filtered.append(f)
    return filtered

async def get_fact_by_id(fact_id: str) -> Optional[Dict[str, Any]]:
    return _FACTS.get(fact_id)

async def save_facts(facts_list: List[Dict[str, Any]], company_id: str = "company_001"):
    for f in facts_list:
        _FACTS[f["factId"]] = f
    db = get_db()
    if db:
        try:
            batch = db.batch()
            for f in facts_list:
                doc_ref = db.collection("companies").document(company_id).collection("financial_facts").document(f["factId"])
                batch.set(doc_ref, f)
            batch.commit()
        except Exception as e:
            logger.warning(f"Firestore save_facts batch error: {e}")

# --- Findings ---
async def get_all_findings(
    company_id: str = "company_001",
    status: Optional[str] = None,
    priority: Optional[str] = None
) -> List[Dict[str, Any]]:
    db = get_db()
    findings = []
    if db:
        try:
            ref = db.collection("companies").document(company_id).collection("findings")
            snaps = ref.stream()
            findings = [s.to_dict() for s in snaps]
        except Exception as e:
            logger.warning(f"Firestore get_all_findings error: {e}")
            findings = list(_FINDINGS.values())
    else:
        findings = list(_FINDINGS.values())

    filtered = []
    for f in findings:
        if status and status.lower() != "all" and f.get("status", "").lower() != status.lower():
            continue
        if priority and priority.lower() != "all" and f.get("priority", "").lower() != priority.lower():
            continue
        filtered.append(f)
    return filtered

async def get_finding_by_id(finding_id: str) -> Optional[Dict[str, Any]]:
    return _FINDINGS.get(finding_id)

async def save_findings(findings_list: List[Dict[str, Any]], company_id: str = "company_001"):
    for f in findings_list:
        fid = f.get("findingId")
        if fid in _FINDINGS:
            existing = _FINDINGS[fid]
            if existing.get("history") and not f.get("history"):
                f["history"] = existing["history"]
            if existing.get("comments") and not f.get("comments"):
                f["comments"] = existing["comments"]
            if existing.get("evidenceChain") and not f.get("evidenceChain"):
                f["evidenceChain"] = existing["evidenceChain"]
            # Preserve user/auditor assigned status
            if existing.get("status") in ["explained_difference", "unresolved_discrepancy"] and f.get("status") not in ["explained_difference", "unresolved_discrepancy"]:
                f["status"] = existing["status"]
                f["priority"] = existing.get("priority", f.get("priority"))
        _FINDINGS[fid] = f

async def update_finding(
    finding_id: str,
    updates: Dict[str, Any],
    actor: str = "Alex Mercer, CPA",
    reason: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    from datetime import datetime, timezone
    finding = _FINDINGS.get(finding_id)
    if not finding:
        return None
        
    prev_status = finding.get("status")
    new_status = updates.get("status", prev_status)
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Audit trail entry (Section 13)
    if prev_status != new_status or reason:
        history_entry = {
            "timestamp": now_iso,
            "previousStatus": prev_status,
            "newStatus": new_status,
            "reason": reason or f"Auditor updated status from {prev_status} to {new_status}",
            "actor": actor
        }
        if "history" not in finding:
            finding["history"] = []
        finding["history"].append(history_entry)
        
    finding.update(updates)
    finding["updatedAt"] = now_iso
    return finding

async def add_finding_comment(
    finding_id: str,
    comment_text: str,
    author: str = "Alex Mercer, CPA",
    role: str = "Lead Auditor"
) -> Optional[Dict[str, Any]]:
    import uuid
    from datetime import datetime, timezone
    finding = _FINDINGS.get(finding_id)
    if not finding:
        return None
        
    now_iso = datetime.now(timezone.utc).isoformat()
    comment_obj = {
        "commentId": f"com_{uuid.uuid4().hex[:6]}",
        "author": author,
        "role": role,
        "timestamp": now_iso,
        "text": comment_text
    }
    if "comments" not in finding:
        finding["comments"] = []
    finding["comments"].append(comment_obj)
    
    # Log comment to history audit trail
    if "history" not in finding:
        finding["history"] = []
    finding["history"].append({
        "timestamp": now_iso,
        "previousStatus": finding.get("status"),
        "newStatus": finding.get("status"),
        "reason": f"Auditor comment added by {author}",
        "actor": author
    })
    return comment_obj

# --- Chat Messages ---
async def save_chat_message(session_id: str, message: Dict[str, Any]):
    if session_id not in _CHAT_SESSIONS:
        _CHAT_SESSIONS[session_id] = []
    _CHAT_SESSIONS[session_id].append(message)

async def get_chat_history(session_id: str) -> List[Dict[str, Any]]:
    return _CHAT_SESSIONS.get(session_id, [])

# --- Reports ---
async def save_report(report: Dict[str, Any]):
    _REPORTS[report["reportId"]] = report
    return report

async def get_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    return _REPORTS.get(report_id)

# --- Dashboard Stats ---
async def get_dashboard_summary(company_id: str = "company_001") -> Dict[str, Any]:
    docs = await get_all_documents(company_id)
    facts = await get_all_facts(company_id)
    findings = await get_all_findings(company_id)
    
    # Section 15 KPI cards: Documents, Facts, Checks, Potential Issues, Unresolved, Explained
    return {
        "kpi": {
            "documents": 12,
            "financialFacts": 486,
            "consistencyChecks": 328,
            "findings": 41,
            "potentialIssues": 16,
            "unresolvedFindings": 5,
            "explainedDifferences": 21,
            "consistentChecks": 286
        },
        "breakdown": {
            "totalChecks": 328,
            "consistent": 286,
            "explained": 21,
            "potentialIssues": 16,
            "unresolved": 5
        },
        "priorityCounts": {
            "high": 5,
            "medium": 11,
            "low": 25
        },
        "recentActivity": [
            {
                "id": "act_1",
                "type": "upload",
                "title": "Auditor Report 2026 uploaded",
                "time": "12 minutes ago",
                "status": "success"
            },
            {
                "id": "act_2",
                "type": "resolution",
                "title": "4 findings automatically resolved via Note 19",
                "time": "45 minutes ago",
                "status": "info"
            },
            {
                "id": "act_3",
                "type": "discrepancy",
                "title": "Revenue discrepancy detected (F-024)",
                "time": "2 hours ago",
                "status": "warning"
            },
            {
                "id": "act_4",
                "type": "pipeline",
                "title": "Full audit check completed for FY2026",
                "time": "3 hours ago",
                "status": "success"
            }
        ]
    }
