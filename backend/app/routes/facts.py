"""
FINCHECK AI - Financial Facts API Routes
"""
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query

from app.database import firestore

router = APIRouter(prefix="/api/facts", tags=["Financial Facts"])

@router.get("")
async def list_financial_facts(
    companyId: str = "company_001",
    metric: Optional[str] = Query(None),
    period: Optional[str] = Query(None),
    scope: Optional[str] = Query(None),
    source: Optional[str] = Query(None)
):
    return await firestore.get_all_facts(
        company_id=companyId,
        metric=metric,
        period=period,
        scope=scope,
        source=source
    )

@router.get("/{fact_id}")
async def get_fact(fact_id: str):
    fact = await firestore.get_fact_by_id(fact_id)
    if not fact:
        raise HTTPException(status_code=404, detail="Financial fact not found")
    return fact
