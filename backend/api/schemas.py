from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: Optional[str] = None
    company_name: str
    phone: Optional[str] = None
    comment: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    city: Optional[str] = None
    nrs_number: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: Optional[str]
    company: Optional[dict]
    profile: Optional[dict]

    class Config:
        orm_mode = True
