import boto3
from botocore.exceptions import ClientError
import os
import uuid

# Эти настройки можно вынести в config.py или получать из .env
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://minio:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minioadmin")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "minioadmin123")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "constructiondocs-files")

s3_client = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name="us-east-1" # MinIO использует заглушку для региона
)

def upload_file_to_s3(file_obj, original_filename: str) -> str:
    """Загружает файл в S3 и возвращает его уникальное имя/путь"""
    extension = original_filename.split(".")[-1] if "." in original_filename else ""
    unique_filename = f"{uuid.uuid4()}.{extension}"

    try:
        s3_client.upload_fileobj(
            file_obj,
            S3_BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": "application/octet-stream"}
        )
        return unique_filename
    except ClientError as e:
        print(f"Ошибка загрузки файла в S3: {e}")
        raise

def get_file_url(filename: str) -> str:
    """Генерирует публичный URL для файла (если бакет публичный)"""
    return f"{S3_ENDPOINT}/{S3_BUCKET_NAME}/{filename}"

def delete_file_from_s3(filename: str):
    """Удаляет файл из S3"""
    try:
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=filename)
    except ClientError as e:
        print(f"Ошибка удаления файла из S3: {e}")
        raise
