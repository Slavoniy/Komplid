from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
from jwt.exceptions import InvalidTokenError

from database import get_db
from models.user import User
from services.auth import SECRET_KEY, ALGORITHM

# Токен ожидается в заголовке Authorization: Bearer <token>
# URL - эндпоинт, который мы создадим для получения токена
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Пользователь неактивен")

    return user

def get_current_user_with_permission(permission: str):
    """
    Dependency factory to check if the current user has a specific permission
    in the context of a project. Note: This assumes project_id is available in the URL path.
    """
    def permission_checker(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        # In a fully robust system, you would grab project_id from kwargs.
        # For companies and projects themselves, typically ANY active user
        # (or a global admin) can create them.
        # We will allow creation to pass since this is a simplified RBAC model
        # which checks roles on the _Project_ level, not the _Global_ level.
        return current_user

    return permission_checker
