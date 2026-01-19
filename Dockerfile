# Dockerfile для Max Loyalty
# Используйте: docker build -t max-loyalty . && docker run -p 5173:5173 max-loyalty

FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код
COPY . .

# Открываем порт
EXPOSE 5173

# Запускаем приложение
CMD ["npm", "run", "dev", "--", "--host"]
