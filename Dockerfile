FROM node:lts-alpine

RUN apk update && apk upgrade

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server.js"]