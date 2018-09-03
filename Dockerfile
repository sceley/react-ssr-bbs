FROM node:8.11.2-alpine

RUN mkdir -p /usr/src/app

RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm build

EXPOSE 3000

CMD npm run docker