FROM python:3.11-slim

WORKDIR /app

# Копируем файл с зависимостями
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# Запускаем моки с помощью Uvicorn на порту 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]