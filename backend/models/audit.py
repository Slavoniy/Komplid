from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Может быть null, если пользователь не авторизован
    action = Column(String, index=True)       # HTTP метод (POST, PUT, DELETE, PATCH)
    entity = Column(String, index=True)       # URL / путь, который запрашивался
    details = Column(JSON, nullable=True)     # Тело запроса или параметры (опционально)
    ip_address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
