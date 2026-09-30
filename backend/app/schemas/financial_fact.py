from typing import Optional
from pydantic import BaseModel, Field

class FinancialFact(BaseModel):
    factId: str = Field(..., description="Unique fact identifier")
    companyId: str = Field(default="company_001")
    documentId: str = Field(..., description="Source document identifier")
    fileName: Optional[str] = Field(default="")
    metric: str = Field(..., description="Financial metric name, e.g. Revenue, EBITDA")
    value: float = Field(..., description="Reported numerical value")
    currency: str = Field(default="INR", description="Currency code (INR, USD, EUR)")
    unit: str = Field(default="crore", description="Original reporting unit (crore, lakh, million, etc.)")
    period: str = Field(default="FY2026", description="Reporting period (e.g. FY2026, Q4 2026)")
    scope: str = Field(default="consolidated", description="Consolidated or Standalone")
    statement: str = Field(default="income_statement", description="Financial statement / section")
    page: int = Field(default=1, description="Page number where fact appears")
    section: Optional[str] = Field(default="", description="Section header or note")
    evidence: str = Field(default="", description="Verbatim textual evidence from document")
    verificationStatus: str = Field(default="verified", description="verified | pending | flagged")
    confidence: float = Field(default=0.95, description="Confidence score 0.0 to 1.0")
    normalizedValue: Optional[float] = Field(default=None, description="Standardized value in base crore/INR")
    normalizedUnit: Optional[str] = Field(default="crore")
    notes: Optional[str] = Field(default=None)

class FactVerificationResult(BaseModel):
    verified: bool = Field(...)
    confidence: float = Field(ge=0.0, le=1.0)
    metric: str = Field(...)
    notes: str = Field(...)
