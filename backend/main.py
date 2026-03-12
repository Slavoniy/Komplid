from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, get_db

app = FastAPI(
    title="ConstructionDocs API",
    description="Микросервис бэкенда для платформы строительной документации",
    version="1.0.0"
)

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
