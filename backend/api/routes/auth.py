from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models.user import User, Profile, Role
from models.company import Company
from api.schemas import UserCreate, Token, ProfileResponse, ProfileUpdate
from services.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from api.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
user_router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=dict)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Проверка, существует ли email
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким email уже существует."
        )

    # Создаем или находим компанию
    company = db.query(Company).filter(Company.name == user_in.company_name).first()
    if not company:
        company = Company(name=user_in.company_name)
        db.add(company)
        db.commit()
        db.refresh(company)

    # Создаем пользователя
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        company_id=company.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Создаем профиль пользователя
    new_profile = Profile(
        user_id=new_user.id,
        phone=user_in.phone
    )
    db.add(new_profile)
    db.commit()

    return {"msg": "Регистрация успешна", "user_id": new_user.id}

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Аутентификация пользователя
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "company": {
            "id": current_user.company.id if current_user.company else None,
            "name": current_user.company.name if current_user.company else None,
        },
        "profile": {
            "phone": current_user.profile.phone if current_user.profile else None,
            "position": current_user.profile.position if current_user.profile else None,
            "city": current_user.profile.city if current_user.profile else None,
            "nrs_number": current_user.profile.nrs_number if current_user.profile else None,
            "avatar_url": current_user.profile.avatar_url if current_user.profile else None,
        }
    }


@user_router.put("/me")
def update_user_me(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Обновляем основную модель пользователя
    if profile_data.first_name:
        current_user.first_name = profile_data.first_name
    if profile_data.last_name:
        current_user.last_name = profile_data.last_name

    # Обновляем профиль
    profile = current_user.profile
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if profile_data.phone is not None:
        profile.phone = profile_data.phone
    if profile_data.position is not None:
        profile.position = profile_data.position
    if profile_data.city is not None:
        profile.city = profile_data.city
    if profile_data.nrs_number is not None:
        profile.nrs_number = profile_data.nrs_number
    if profile_data.avatar_url is not None:
        profile.avatar_url = profile_data.avatar_url

    db.commit()
    db.refresh(current_user)

    return {"msg": "Профиль обновлен"}
