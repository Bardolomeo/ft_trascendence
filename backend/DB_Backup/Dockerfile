FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-cache

COPY . .
RUN npm run build

# Create backup directory
RUN mkdir -p /app/backups

EXPOSE 3001

CMD ["npm", "start"]
