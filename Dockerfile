FROM node:8.11.4

RUN mkdir -p /usr/src/app

# RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

EXPOSE 80

CMD npm run pro