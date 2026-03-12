#!/bin/bash

# Скрипт для резервного копирования БД PostgreSQL и загрузки в S3

set -e

# --- Конфигурация базы данных ---
DB_CONTAINER="constructiondocs_db"
DB_USER="postgres"
DB_NAME="constructiondocs"

# --- Конфигурация S3 (MinIO / Timeweb S3) ---
S3_ENDPOINT="http://localhost:9000"  # На проде заменить на URL реального S3
S3_BUCKET="myminio/constructiondocs-files/backups" # Для AWS CLI или mc
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin123"

# --- Настройки бэкапа ---
BACKUP_DIR="/tmp/db_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"

# Создаем временную директорию
mkdir -p "$BACKUP_DIR"

echo "Начинаем создание бэкапа БД $DB_NAME..."

# 1. Снимаем дамп через docker exec и архивируем
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "Бэкап успешно создан: $BACKUP_FILE"

# 2. Загрузка в S3 через MinIO Client (mc)
# Если на сервере не установлен mc, можно запустить его через Docker
echo "Загрузка бэкапа в S3..."
docker run --rm --network host -v "$BACKUP_DIR:/backups" \
  --entrypoint /bin/sh \
  minio/mc -c "
  mc alias set myminio $S3_ENDPOINT $S3_ACCESS_KEY $S3_SECRET_KEY;
  mc cp /backups/$(basename "$BACKUP_FILE") $S3_BUCKET/;
"

echo "Бэкап успешно загружен в S3!"

# 3. Очистка старых бэкапов (оставляем только на сервере S3)
rm -f "$BACKUP_FILE"

# 4. (Опционально) Удаление старых бэкапов в S3 (например, старше 7 дней)
# docker run --rm --entrypoint /bin/sh minio/mc -c "
#   mc alias set myminio $S3_ENDPOINT $S3_ACCESS_KEY $S3_SECRET_KEY;
#   mc rm --older-than 7d $S3_BUCKET/;
# "

echo "Процесс резервного копирования завершен."
