import os
import sys

# Добавляем путь к корню бэкенда
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models.user import Role

# Роли и их разрешения (permissions)
DEFAULT_ROLES = [
    {
        "name": "Администратор системы",
        "permissions": {
            "can_manage_users": True,
            "can_manage_roles": True,
            "can_edit_project": True,
            "can_read_documents": True,
            "can_edit_documents": True,
            "can_sign_documents": True,
            "can_approve_documents": True
        }
    },
    {
        "name": "ГИП",
        "permissions": {
            "can_manage_users": False,
            "can_manage_roles": True,
            "can_edit_project": True,
            "can_read_documents": True,
            "can_edit_documents": True,
            "can_sign_documents": True,
            "can_approve_documents": True
        }
    },
    {
        "name": "Инженер ПТО",
        "permissions": {
            "can_manage_users": False,
            "can_manage_roles": False,
            "can_edit_project": False,
            "can_read_documents": True,
            "can_edit_documents": True,
            "can_sign_documents": False,
            "can_approve_documents": False
        }
    },
    {
        "name": "Подрядчик",
        "permissions": {
            "can_manage_users": False,
            "can_manage_roles": False,
            "can_edit_project": False,
            "can_read_documents": True,
            "can_edit_documents": True,
            "can_sign_documents": True,
            "can_approve_documents": False
        }
    },
    {
        "name": "Технадзор",
        "permissions": {
            "can_manage_users": False,
            "can_manage_roles": False,
            "can_edit_project": False,
            "can_read_documents": True,
            "can_edit_documents": False,
            "can_sign_documents": True,
            "can_approve_documents": True
        }
    }
]

def seed_roles():
    db = SessionLocal()
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).all()
        existing_role_names = [r.name for r in existing_roles]

        for role_data in DEFAULT_ROLES:
            if role_data["name"] not in existing_role_names:
                new_role = Role(
                    name=role_data["name"],
                    permissions=role_data["permissions"]
                )
                db.add(new_role)
                print(f"Added role: {role_data['name']}")
            else:
                # Update permissions for existing role
                existing_role = db.query(Role).filter(Role.name == role_data["name"]).first()
                existing_role.permissions = role_data["permissions"]
                print(f"Updated role: {role_data['name']}")

        db.commit()
        print("Roles seeded successfully.")
    except Exception as e:
        print(f"Error seeding roles: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()
