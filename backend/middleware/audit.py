from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
import json
import logging

from database import SessionLocal
from models.audit import AuditLog

logger = logging.getLogger(__name__)

class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method

        # Логируем только действия, которые могут менять состояние (и не опции)
        if method in ["POST", "PUT", "DELETE", "PATCH"]:
            url = str(request.url.path)
            ip_address = request.client.host if request.client else "unknown"

            # Попытаемся прочитать тело запроса
            # Чтение тела асинхронно до call_next - известная сложность в FastAPI (Starlette),
            # поэтому мы можем логировать только заголовки или параметры запроса.
            # Если нужно логировать тело, то лучше использовать Custom APIRoute,
            # но для начала (и простых задач) залогируем хотя бы путь и метод.
            details = {
                "query_params": dict(request.query_params)
            }

            # ID пользователя можно достать из токена, если он уже есть в headers (заглушка)
            user_id = None
            if "Authorization" in request.headers:
                # В будущем тут можно доставать ID пользователя из JWT
                pass

            db: Session = SessionLocal()
            try:
                audit_entry = AuditLog(
                    user_id=user_id,
                    action=method,
                    entity=url,
                    details=details,
                    ip_address=ip_address
                )
                db.add(audit_entry)
                db.commit()
            except Exception as e:
                logger.error(f"Failed to create audit log: {e}")
            finally:
                db.close()

        # Пропускаем запрос дальше
        response = await call_next(request)
        return response
