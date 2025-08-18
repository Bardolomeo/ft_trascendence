FROM alpine:latest

RUN apk update && apk upgrade && apk add nginx

#RUN rm -rf /etc/nginx/sites-available/default

#COPY default /etc/nginx/sites-available/default

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]

#CMD ["/usr/sbin/nginx", "-g", "daemon off;"]