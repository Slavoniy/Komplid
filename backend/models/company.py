from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    inn = Column(String(12), nullable=True, unique=True, index=True)
    ogrn = Column(String(15), nullable=True, unique=True, index=True)
    sro_build = Column(String(255), nullable=True)
    sro_project = Column(String(255), nullable=True)

    users = relationship("User", back_populates="company")
    projects = relationship("Project", foreign_keys="[Project.company_id]", back_populates="company")
    general_contractor_projects = relationship("Project", foreign_keys="[Project.general_contractor_id]", back_populates="general_contractor")
