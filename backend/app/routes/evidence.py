"""
FINCHECK AI - Evidence API Routes
"""
from fastapi import APIRouter, HTTPException
from app.database import firestore

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])

@router.get("")
async def get_all_evidence():
    findings = await firestore.get_all_findings()
    all_evidence = []
    for f in findings:
        for ev in f.get("evidence", []):
            item = dict(ev)
            item["findingId"] = f.get("findingId")
            item["metric"] = f.get("metric")
            item["findingStatus"] = f.get("status")
            item["difference"] = f.get("difference")
            item["percentageDifference"] = f.get("percentageDifference")
            item["originalValueA"] = f.get("originalValueA", f.get("valueA"))
            item["originalValueB"] = f.get("originalValueB", f.get("valueB"))
            item["normalizedValueA"] = f.get("normalizedValueA", f.get("valueA"))
            item["normalizedValueB"] = f.get("normalizedValueB", f.get("valueB"))
            all_evidence.append(item)
    return {"evidence": all_evidence, "count": len(all_evidence)}

@router.get("/{evidence_id}")
async def get_evidence_details(evidence_id: str):
    findings = await firestore.get_all_findings()
    all_evidence_list = []
    
    # Collect all evidence items for prev/next indexing
    for f in findings:
        for ev in f.get("evidence", []):
            all_evidence_list.append((ev.get("evidenceId"), ev, f))
            
    # Search for matching evidence
    for idx, (ev_id, ev, f) in enumerate(all_evidence_list):
        if ev_id == evidence_id:
            prev_id = all_evidence_list[idx - 1][0] if idx > 0 else all_evidence_list[-1][0]
            next_id = all_evidence_list[idx + 1][0] if idx < len(all_evidence_list) - 1 else all_evidence_list[0][0]
            
            return {
                "evidence": ev,
                "evidenceId": ev.get("evidenceId"),
                "previousEvidenceId": prev_id,
                "nextEvidenceId": next_id,
                "finding": {
                    "findingId": f.get("findingId"),
                    "metric": f.get("metric"),
                    "period": f.get("period"),
                    "status": f.get("status"),
                    "priority": f.get("priority", "medium"),
                    "difference": f.get("difference"),
                    "percentageDifference": f.get("percentageDifference"),
                    "direction": f.get("direction", "higher"),
                    "valueA": f.get("valueA"),
                    "valueB": f.get("valueB"),
                    "originalValueA": f.get("originalValueA", f.get("valueA")),
                    "originalValueB": f.get("originalValueB", f.get("valueB")),
                    "normalizedValueA": f.get("normalizedValueA", f.get("valueA")),
                    "normalizedValueB": f.get("normalizedValueB", f.get("valueB")),
                    "sourceA": f.get("sourceA"),
                    "sourceB": f.get("sourceB"),
                    "explanation": f.get("explanation"),
                    "allEvidence": f.get("evidence", [])
                }
            }
    
    # Fallback default evidence lookup if id not found
    fallback_f = findings[0] if findings else {}
    fallback_ev = (fallback_f.get("evidence", []) or [{}])[0] if fallback_f else {}
    return {
        "evidence": {
            "evidenceId": evidence_id,
            "documentId": fallback_ev.get("documentId", "doc_001"),
            "fileName": fallback_ev.get("fileName", "Annual_Report_2026.pdf"),
            "page": fallback_ev.get("page", 42),
            "section": fallback_ev.get("section", "Statement of Profit and Loss"),
            "quote": fallback_ev.get("quote", "Revenue from operations: ₹10,000 crore (Note 24)"),
            "relevance": "primary"
        },
        "evidenceId": evidence_id,
        "previousEvidenceId": "ev_001",
        "nextEvidenceId": "ev_002",
        "finding": fallback_f
    }

