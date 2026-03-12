from fastapi import FastAPI
from pydantic import BaseModel
import uuid
import time

app = FastAPI(title="BuildDocs Mock Integration Services")

# --- Мок для 1С ---
class ContractorData(BaseModel):
    inn: str

@app.post("/1c/contractor/info")
def get_contractor_info(data: ContractorData):
    """Возвращает замоканную информацию о подрядчике из 1С"""
    return {
        "inn": data.inn,
        "name": f"ООО Ромашка (ИНН: {data.inn})",
        "kpp": "123456789",
        "ogrn": "1234567890123",
        "legal_address": "г. Москва, ул. Строителей, д. 1",
        "status": "active"
    }

# --- Мок для КриптоПро (УКЭП) ---
class DocumentSignRequest(BaseModel):
    document_id: str
    user_id: str

@app.post("/cryptopro/sign")
def sign_document(req: DocumentSignRequest):
    """Имитирует подписание документа УКЭП"""
    # Имитируем задержку сервиса подписи
    time.sleep(1)
    return {
        "status": "success",
        "document_id": req.document_id,
        "signature_id": str(uuid.uuid4()),
        "timestamp": time.time(),
        "cert_info": "Сертификат действителен. Владелец: ГИП Иванов И.И."
    }

@app.get("/health")
def health():
    return {"status": "ok"}