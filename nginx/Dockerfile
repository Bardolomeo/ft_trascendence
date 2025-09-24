FROM alpine:latest


RUN apk update && apk upgrade && apk add nginx && apk add openssl

COPY ./script.sh /script.sh

#EXPOSE 80/tcp

CMD ["sh", "./script.sh"]