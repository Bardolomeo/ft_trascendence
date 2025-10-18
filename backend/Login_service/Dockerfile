FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --no-cache

COPY . .

RUN npm ci @types/node --save-dev

RUN npm run build
EXPOSE 3001

CMD ["npm", "start"]