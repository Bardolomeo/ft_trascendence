#!/bin/sh

if [ ! -f /etc/nginx/certs/key.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/certs/nginx.key -out /etc/nginx/certs/nginx.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=Italy/L=Florence/O=42temp/OU=42temp/CN=ultrapong"
fi

chmod +rrr /etc/nginx/certs/nginx.crt
chmod +rrr /etc/nginx/certs/nginx.key

/usr/sbin/nginx -g 'daemon off;'