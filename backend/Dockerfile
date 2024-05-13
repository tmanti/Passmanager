FROM node:20-alpine as base

EXPOSE 3001

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i npm@latest -g
RUN npm ci

COPY .env ./
COPY src/ ./

ENTRYPOINT ["node", "server.js"]