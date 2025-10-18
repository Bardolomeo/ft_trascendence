#!/bin/sh

if [ ! -f /etc/nginx/certs/key.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/certs/ultrapong.key -out /etc/nginx/certs/ultrapong.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=Italy/L=Florence/O=42temp/OU=42temp/CN=nginx"
fi

chmod +rrr /etc/nginx/certs/ultrapong.crt
chmod +rrr /etc/nginx/certs/ultrapong.key

/usr/sbin/nginx -g 'daemon off;'