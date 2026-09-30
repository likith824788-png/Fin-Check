from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ReportGenerateRequest(BaseModel):
    reportType: str = Field(default="complete_audit", description="executive_summary | detailed_consistency | findings_report | evidence_report | complete_audit")
    companyId: str = Field(default="company_001")
    period: str = Field(default="FY2026")
    documentIds: List[str] = Field(default_factory=list)
    includeEvidence: bool = True

class ReportSummary(BaseModel):
    reportId: str
    title: str
    reportType: str
    companyId: str
    period: str
    totalDocuments: int
    totalFacts: int
    totalChecks: int
    totalFindings: int
    highPriorityFindings: int
    createdAt: str
    downloadUrl: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
