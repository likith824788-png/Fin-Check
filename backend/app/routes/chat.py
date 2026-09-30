"""
FINCHECK AI - AI Auditor Chat API
"""
import uuid
import re
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter

from app.schemas.chat import ChatQueryRequest, ChatQueryResponse, ChatEvidenceReference
from app.database import firestore
from app.ai.groq import chat_auditor_groq

router = APIRouter(prefix="/api/chat", tags=["AI Auditor"])

def detect_query_target_metric(query: str) -> Optional[str]:
    q = query.lower()
    if "revenue" in q or "sales" in q or "turnover" in q:
        return "Revenue"
    if "ebitda" in q or "operating margin" in q:
        return "EBITDA"
    if "profit" in q or "pat" in q or "net income" in q:
        return "Net Profit"
    if "asset" in q:
        return "Total Assets"
    if "cash" in q or "operating cash" in q:
        return "Operating Cash Flow"
    if "eps" in q or "earnings per share" in q:
        return "EPS"
    if "debt" in q or "borrow" in q:
        return "Borrowings"
    return None

@router.post("", response_model=ChatQueryResponse)
async def query_ai_auditor(payload: ChatQueryRequest):
    session_id = payload.sessionId or "default_session"
    detected_metric = payload.metric or detect_query_target_metric(payload.query)
    
    # Structured Firestore queries for full grounding
    documents = await firestore.get_all_documents(payload.companyId)
    all_facts = await firestore.get_all_facts(payload.companyId)
    all_findings = await firestore.get_all_findings(payload.companyId)

    history = await firestore.get_chat_history(session_id)
    history_tuples = [{"role": m["sender"], "content": m["text"]} for m in history]

    # Call Groq with strictly retrieved structured facts, findings, and documents
    reply_text = await chat_auditor_groq(
        user_query=payload.query,
        retrieved_facts=all_facts,
        retrieved_findings=all_findings,
        retrieved_documents=documents,
        session_history=history_tuples
    )

    # Format relevant source references for frontend action buttons
    sources = []
    related_findings = []
    
    # Match findings relevant to query
    q_lower = payload.query.lower()
    for f in all_findings:
        metric_match = f.get("metric", "").lower() in q_lower
        finding_match = f.get("findingId", "").lower() in q_lower
        is_issue = f.get("status") in ["potential_issue", "unresolved_discrepancy"]
        
        if metric_match or finding_match or (is_issue and len(sources) < 4):
            related_findings.append(f["findingId"])
            src_a = f.get("sourceA", {})
            if src_a and src_a.get("fileName"):
                sources.append(ChatEvidenceReference(
                    title=f"{src_a.get('fileName')} (p.{src_a.get('page')}) — ₹{src_a.get('value')} Cr",
                    document=src_a.get("fileName", "Document"),
                    page=src_a.get("page", 1),
                    quote=src_a.get("evidence", ""),
                    findingId=f.get("findingId")
                ))
            src_b = f.get("sourceB", {})
            if src_b and src_b.get("fileName"):
                sources.append(ChatEvidenceReference(
                    title=f"{src_b.get('fileName')} (p.{src_b.get('page')}) — ₹{src_b.get('value')} Cr",
                    document=src_b.get("fileName", "Document"),
                    page=src_b.get("page", 1),
                    quote=src_b.get("evidence", ""),
                    findingId=f.get("findingId")
                ))

    # Persist interaction
    user_msg = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "sender": "user",
        "text": payload.query,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    ai_msg = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "sender": "assistant",
        "text": reply_text,
        "sources": [s.model_dump() for s in sources],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await firestore.save_chat_message(session_id, user_msg)
    await firestore.save_chat_message(session_id, ai_msg)

    return ChatQueryResponse(
        reply=reply_text,
        sources=sources,
        relatedFindings=related_findings,
        suggestedActions=[
            "View Evidence",
            "Open Finding F-024",
            "Explain Profit Changes",
            "Generate Consistency Report"
        ]
    )

@router.get("/history")
async def get_history(sessionId: str = "default_session"):
    return await firestore.get_chat_history(sessionId)
