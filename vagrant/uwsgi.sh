if [ ! -f /etc/init/uwsgi.conf ]; then
    mv /home/vagrant/uwsgi.conf /etc/init/uwsgi.conf
fi

getent passwd uwsgi > /dev/null
if [ $? -ne 0 ]; then
    useradd -c 'uwsgi user' -g nginx --system --no-create-home --shell /bin/false uwsgi
fi

apt-get install -y uwsgi uwsgi-plugin-python