FROM node:latest

RUN apt-get update && apt-get install -y wget gnupg g++ apt-utils curl git && apt-get clean

RUN apt-get update && apt-get install -y npm && apt-get clean

COPY ./App /App

WORKDIR /App

RUN npm i

COPY script.sh /

RUN chmod +x /script.sh

CMD ["/script.sh"]