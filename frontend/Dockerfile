FROM node:20-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем приложение

# Экспонируем порт Vite (по умолчанию 5173)
EXPOSE 5173

# Команда для запуска режима dev в docker, чтобы работал HMR,
# либо можно использовать serve для production, но пока для разработки
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]