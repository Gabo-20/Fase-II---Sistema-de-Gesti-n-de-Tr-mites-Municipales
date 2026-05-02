FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

RUN npm prune --omit=dev

COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]
