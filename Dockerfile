FROM node:20-bullseye

WORKDIR /usr/app/server

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY .env.docker ./
COPY prisma ./prisma
COPY ./src ./src

RUN npx prisma generate

EXPOSE 3000