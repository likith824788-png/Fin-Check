from typing import Optional
from pydantic import BaseModel, Field

class DocumentMetadata(BaseModel):
    documentId: str = Field(...)
    companyId: str = Field(default="company_001")
    fileName: str = Field(...)
    documentType: str = Field(default="annual_report", description="annual_report | quarterly_report | commentary | audit_report")
    period: str = Field(default="FY2026")
    fileSize: int = Field(default=0)
    status: str = Field(default="uploaded", description="uploaded | processing | analyzed | failed")
    progress: int = Field(default=0, ge=0, le=100)
    storagePath: Optional[str] = None
    factCount: int = Field(default=0)
    createdAt: str
    uploadedAt: Optional[str] = None
