from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import Role
from models.project import UserProjectRole, Project
from models.user import User
from api.schemas import RoleResponse, UserProjectRoleResponse, UserProjectRoleCreate
from api.deps import get_current_user

router = APIRouter(prefix="/api/roles", tags=["roles"])

@router.get("/", response_model=List[RoleResponse])
def get_roles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Получить список всех доступных ролей"""
    roles = db.query(Role).all()
    return roles

@router.get("/project/{project_id}", response_model=List[UserProjectRoleResponse])
def get_project_users(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Получить список пользователей и их ролей в конкретном проекте"""

    # Check if project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    roles = db.query(UserProjectRole).filter(UserProjectRole.project_id == project_id).all()

    # Map user data into the response
    result = []
    for role in roles:
        user = db.query(User).filter(User.id == role.user_id).first()
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        } if user else None

        result.append({
            "id": role.id,
            "user_id": role.user_id,
            "project_id": role.project_id,
            "role_id": role.role_id,
            "role": role.role,
            "user": user_data
        })

    return result

from api.deps import get_current_user_with_permission

@router.post("/assign", response_model=UserProjectRoleResponse, status_code=status.HTTP_201_CREATED)
def assign_role(assignment: UserProjectRoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Назначить пользователю роль в проекте"""

    # Verify user exists
    user = db.query(User).filter(User.id == assignment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Verify project exists
    project = db.query(Project).filter(Project.id == assignment.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    # Verify role exists
    role = db.query(Role).filter(Role.id == assignment.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Роль не найдена")

    # Check if user already has a role in this project
    existing = db.query(UserProjectRole).filter(
        UserProjectRole.user_id == assignment.user_id,
        UserProjectRole.project_id == assignment.project_id
    ).first()

    if existing:
        # Update existing role
        existing.role_id = assignment.role_id
        db.commit()
        db.refresh(existing)
        return {"id": existing.id, "user_id": existing.user_id, "project_id": existing.project_id, "role_id": existing.role_id, "role": role, "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}}

    # Create new assignment
    new_assignment = UserProjectRole(
        user_id=assignment.user_id,
        project_id=assignment.project_id,
        role_id=assignment.role_id
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return {"id": new_assignment.id, "user_id": new_assignment.user_id, "project_id": new_assignment.project_id, "role_id": new_assignment.role_id, "role": role, "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}}

@router.delete("/remove/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_role(assignment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Удалить пользователя из проекта (удалить роль)"""
    assignment = db.query(UserProjectRole).filter(UserProjectRole.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Назначение не найдено")

    db.delete(assignment)
    db.commit()
    return None