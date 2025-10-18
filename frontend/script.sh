#!/bin/bash

chmod 644 /certs/ultrapong.crt

mv /certs/ultrapong.crt /usr/local/share/ca-certificates/ultrapong.crt && update-ca-certificates


export NODE_EXTRA_CA_CERTS=/certs/ultrapong.crt

npm start;