FROM node:latest

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install npm -y

WORKDIR /App

COPY ./App /App

RUN npm i

RUN npm i nodemon --global

RUN npm i ts-node --global

CMD ["npm", "start"]