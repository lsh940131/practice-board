FROM node:20
WORKDIR /usr/app/server
COPY . ./
RUN npm install
RUN npm run prisma:gen
EXPOSE 3000