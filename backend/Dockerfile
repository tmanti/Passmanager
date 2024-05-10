FROM node:20 as base

EXPOSE 3001

COPY src/ /app/
COPY package.json /app/
COPY package-lock.json /app/
COPY .env /app/

WORKDIR /app
RUN npm i npm@latest -g
RUN npm ci

ENTRYPOINT ["node", "server.js"]