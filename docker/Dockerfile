FROM node:9.4.0-alpine

WORKDIR /usr/repo

RUN apk update && apk add git python make g++

RUN npm install -g truffle@4.1.0

COPY ./project/package.json /usr/repo/package.json

RUN npm install

ENTRYPOINT tail -f /dev/null