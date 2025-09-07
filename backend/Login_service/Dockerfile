FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --no-cache

COPY . .
RUN npm run build
EXPOSE 8080

CMD ["npm", "start"]