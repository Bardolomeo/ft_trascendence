FROM node:latest

RUN apt-get update && apt-get install -y wget gnupg g++ apt-utils curl git && apt-get clean

RUN apt-get update && apt-get install -y npm && apt-get clean

RUN apt install npm

COPY ./App /App

WORKDIR /App

RUN npm i

CMD ["sleep", "1h"]