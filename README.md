# BuildDocs: Автоматизация строительной исполнительной документации

Платформа B2B SaaS для генерации и ведения строительной документации (АОСР, акты КС-2/КС-3, общие журналы работ). Проект спроектирован с учетом требований ФЗ-152 и стандартов Ростехнадзора, СНиП, СП и ГОСТ.

## Архитектура
- **Бэкенд:** FastAPI (Python), SQLAlchemy, Alembic (порт 8000)
- **Фронтенд:** React 19, Vite, TypeScript, Tailwind CSS, Zustand, React Hook Form (порт 5173)
- **База данных:** PostgreSQL 15+
- **Моки:** FastAPI для интеграции с КриптоПро и 1С (порт 8001)

## Как запустить проект

Для запуска всей инфраструктуры в Docker вам понадобится установленный `docker` и `docker-compose`.

Выполните команду в корне репозитория:

```bash
docker-compose up --build
```

### Доступ к сервисам после запуска:
- **Frontend (UI):** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Mock Services (1С, CryptoPro):** [http://localhost:8001/docs](http://localhost:8001/docs)

### Остановка
```bash
docker-compose down
```

## Структура проекта
- `/backend`: Код приложения FastAPI, схемы, роуты и миграции (alembic)
- `/frontend`: SPA приложение React (Vite)
- `/mock_services`: Заглушки внешних API-сервисов, с которыми в будущем будет работать бэкенд (подписание УКЭП, запросы к 1С).
- `/tilda_scripts`: Директория для скриптов (JS/Python), используемых для интеграции маркетинговых лендингов на Tilda.
- `TODO.md`: Подробный бэклог и план развития проекта на основе утвержденного дизайна.

## Разработка
- При редактировании кода бэкенда (`/backend`) или фронтенда (`/frontend`) серверы внутри Docker-контейнеров автоматически перезапускаются (Hot Reload).
- При добавлении новых моделей в `backend/database.py`, создайте новую миграцию Alembic, зайдя в контейнер бэкенда:
  `docker exec -it builddocs_backend alembic revision --autogenerate -m "Initial"`
  И примените её: `docker exec -it builddocs_backend alembic upgrade head`