FROM alpine:latest

RUN apk update && apk upgrade && apk add nginx

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]