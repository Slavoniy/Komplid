from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(String(500), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    general_contractor_id = Column(Integer, ForeignKey("companies.id"), nullable=True)

    company = relationship("Company", foreign_keys=[company_id], back_populates="projects")
    general_contractor = relationship("Company", foreign_keys=[general_contractor_id], back_populates="general_contractor_projects")
    user_roles = relationship("UserProjectRole", back_populates="project")


class UserProjectRole(Base):
    __tablename__ = "user_project_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    user = relationship("User", back_populates="project_roles")
    project = relationship("Project", back_populates="user_roles")
    role = relationship("Role", back_populates="project_roles")
