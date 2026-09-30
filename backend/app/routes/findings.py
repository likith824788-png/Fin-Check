"""
FINCHECK AI - Findings API Routes
Supports listing, retrieval, status updates (Mark Explained, Confirm, Resolve),
and auditor audit trail comments.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Query

from app.database import firestore

router = APIRouter(prefix="/api/findings", tags=["Findings"])

class FindingUpdateRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    reason: Optional[str] = None
    actor: Optional[str] = "Alex Mercer, CPA"

class FindingCommentRequest(BaseModel):
    text: str
    author: Optional[str] = "Alex Mercer, CPA"
    role: Optional[str] = "Lead Auditor"

@router.get("")
async def list_findings(
    companyId: str = "company_001",
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None)
):
    return await firestore.get_all_findings(
        company_id=companyId,
        status=status,
        priority=priority
    )

@router.get("/{finding_id}")
async def get_finding(finding_id: str):
    finding = await firestore.get_finding_by_id(finding_id)
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    return finding

@router.patch("/{finding_id}")
async def update_finding_status(finding_id: str, payload: FindingUpdateRequest):
    updates = {}
    if payload.status is not None:
        updates["status"] = payload.status
    if payload.priority is not None:
        updates["priority"] = payload.priority
        
    updated = await firestore.update_finding(
        finding_id=finding_id,
        updates=updates,
        actor=payload.actor or "Alex Mercer, CPA",
        reason=payload.reason
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Finding not found")
    return updated

@router.post("/{finding_id}/comments")
async def add_finding_comment(finding_id: str, payload: FindingCommentRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Comment text cannot be empty")
        
    comment = await firestore.add_finding_comment(
        finding_id=finding_id,
        comment_text=payload.text,
        author=payload.author or "Alex Mercer, CPA",
        role=payload.role or "Lead Auditor"
    )
    if not comment:
        raise HTTPException(status_code=404, detail="Finding not found")
    return comment
