from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    inn = Column(String(12), nullable=True, unique=True, index=True)

    users = relationship("User", back_populates="company")
    projects = relationship("Project", back_populates="company")
