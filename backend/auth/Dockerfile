FROM node:latest

RUN apt update && apt upgrade

RUN apt install npm

RUN npm i

RUN npm i nodemon --global

COPY ./App /App

WORKDIR /App

RUN npm start