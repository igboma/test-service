FROM node:lts-alpine

RUN apk update && apk upgrade

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./app ./app
COPY ./test ./test
COPY ./config ./config
COPY ./Makefile ./
COPY ./server.js ./


CMD ["node", "server.js"]