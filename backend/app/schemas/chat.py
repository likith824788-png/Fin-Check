from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ChatQueryRequest(BaseModel):
    query: str = Field(..., min_length=1)
    companyId: str = Field(default="company_001")
    findingId: Optional[str] = None
    metric: Optional[str] = None
    sessionId: Optional[str] = None

class ChatEvidenceReference(BaseModel):
    title: str
    document: str
    page: int
    quote: str
    findingId: Optional[str] = None

class ChatQueryResponse(BaseModel):
    reply: str
    sources: List[ChatEvidenceReference] = Field(default_factory=list)
    relatedFindings: List[str] = Field(default_factory=list)
    suggestedActions: List[str] = Field(default_factory=list)
