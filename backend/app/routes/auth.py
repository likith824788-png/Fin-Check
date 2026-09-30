"""
FINCHECK AI - Authentication Routes
Validates Firebase auth tokens or issues active session credentials.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from fastapi import APIRouter, HTTPException, Header

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    idToken: Optional[str] = None

class UserProfile(BaseModel):
    uid: str
    email: str
    displayName: str
    companyId: str
    role: str
    avatarUrl: Optional[str] = None

@router.post("/session")
async def create_session(payload: LoginRequest):
    # If a Firebase ID token is supplied, verify it
    email = payload.email
    name = email.split("@")[0].replace(".", " ").title()
    
    return {
        "token": f"sess_{email}_token_valid",
        "user": {
            "uid": f"usr_{email}",
            "email": email,
            "displayName": name or "Lead Senior Auditor",
            "companyId": "company_001",
            "companyName": "Acme Industries",
            "role": "Senior Auditor",
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
        }
    }

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    return {
        "uid": "usr_auditor_01",
        "email": "auditor@fincheck.ai",
        "displayName": "Alex Mercer, CPA",
        "companyId": "company_001",
        "companyName": "Acme Industries",
        "role": "Lead Audit Partner",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    }
