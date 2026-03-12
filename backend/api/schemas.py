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


class CompanyBase(BaseModel):
    name: str
    inn: Optional[str] = None
    ogrn: Optional[str] = None
    sro_build: Optional[str] = None
    sro_project: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(CompanyBase):
    name: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True


class RoleBase(BaseModel):
    name: str
    permissions: dict

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True


class UserProjectRoleBase(BaseModel):
    user_id: int
    project_id: int
    role_id: int

class UserProjectRoleCreate(UserProjectRoleBase):
    pass

class UserProjectRoleResponse(UserProjectRoleBase):
    id: int
    role: Optional[RoleResponse] = None
    # We might want some basic user info here too
    user: Optional[dict] = None

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    name: str
    address: Optional[str] = None
    general_contractor_id: Optional[int] = None

class ProjectCreate(ProjectBase):
    company_id: int

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    company_id: int
    general_contractor: Optional[CompanyResponse] = None

    class Config:
        from_attributes = True
