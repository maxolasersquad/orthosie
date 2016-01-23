#!/usr/bin/env bash
wget -q http://nginx.org/keys/nginx_signing.key -O- | apt-key add -
if ! grep --quiet "deb http://nginx.org/packages/ubuntu/ trusty nginx" /etc/apt/sources.list; then
    echo deb http://nginx.org/packages/ubuntu/ trusty nginx >> /etc/apt/sources.list
fi
apt-get update
apt-get install -y nginx-common

getent passwd uwsgi  > /dev/null
if [ ! $? -eq 0 ]; then
    useradd -c 'uwsgi user' -g nginx --system --no-create-home --shell /bin/false uwsgi
fi
