from fastapi import FastAPI, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, get_db
import sys
import os

# Добавляем путь, чтобы импорты из services работали
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.s3_service import upload_file_to_s3, get_file_url, delete_file_from_s3
from middleware.audit import AuditLogMiddleware

app = FastAPI(
    title="ConstructionDocs API",
    description="Микросервис бэкенда для платформы строительной документации",
    version="1.0.0"
)

# Подключаем middleware для логирования действий
app.add_middleware(AuditLogMiddleware)

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    \"\"\"
    Проверка здоровья сервиса и подключения к БД.
    \"\"\"
    try:
        # Простая проверка соединения
        result = db.execute(text("SELECT 1"))
        result.fetchone()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": f"disconnected ({str(e)})"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Эндпоинт для загрузки файлов (PDF, сертификаты) в S3 (MinIO).
    """
    try:
        file_path = upload_file_to_s3(file.file, file.filename)
        return {
            "status": "success",
            "filename": file_path,
            "url": get_file_url(file_path)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
