from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.company import Company
from api.schemas import CompanyCreate, CompanyResponse, CompanyUpdate
from api.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/api/companies", tags=["companies"])

@router.get("/", response_model=List[CompanyResponse])
def get_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    companies = db.query(Company).offset(skip).limit(limit).all()
    return companies

@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")
    return company

from api.deps import get_current_user, get_current_user_with_permission

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company_in: CompanyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_with_permission("can_edit_project"))):
    # Check if company with INN or OGRN exists
    if company_in.inn:
        if db.query(Company).filter(Company.inn == company_in.inn).first():
            raise HTTPException(status_code=400, detail="Компания с таким ИНН уже существует")
    if company_in.ogrn:
        if db.query(Company).filter(Company.ogrn == company_in.ogrn).first():
            raise HTTPException(status_code=400, detail="Компания с таким ОГРН уже существует")

    company = Company(
        name=company_in.name,
        inn=company_in.inn,
        ogrn=company_in.ogrn,
        sro_build=company_in.sro_build,
        sro_project=company_in.sro_project
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(company_id: int, company_in: CompanyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_with_permission("can_edit_project"))):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")

    update_data = company_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)
    return company

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_with_permission("can_edit_project"))):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")

    db.delete(company)
    db.commit()
    return None
