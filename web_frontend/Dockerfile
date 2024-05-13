FROM node:20 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i npm@latest -g
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

EXPOSE 3000

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

RUN npm install next

ENTRYPOINT ["npm", "run", "start"]