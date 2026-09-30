from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FindingSource(BaseModel):
    documentId: str
    fileName: str
    page: int
    section: Optional[str] = ""
    value: float
    unit: str = "crore"
    currency: str = "INR"
    evidence: str

class EvidenceItem(BaseModel):
    evidenceId: str
    documentId: str
    fileName: str
    page: int
    section: str
    quote: str
    relevance: str = "primary"

class Finding(BaseModel):
    findingId: str = Field(..., description="Unique finding ID e.g. F-024")
    companyId: str = Field(default="company_001")
    metric: str
    period: str
    scope: str
    currency: str = "INR"
    sourceA: FindingSource
    sourceB: FindingSource
    valueA: float
    valueB: float
    difference: float
    percentageDifference: float
    status: str = Field(
        default="potential_issue",
        description="consistent | explained_difference | potential_issue | unresolved_discrepancy"
    )
    priority: str = Field(default="medium", description="high | medium | low")
    explanation: str
    recommendation: Optional[str] = None
    evidence: List[EvidenceItem] = Field(default_factory=list)
    hasExplanatoryDisclosure: bool = False
    createdAt: str
