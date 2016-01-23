#!/usr/bin/env bash
sudo pip3 install virtualenv virtualenvwrapper
if ! grep --quiet "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" ~/.bashrc; then
    echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" >> ~/.bashrc
fi
if ! grep --quiet "export WORKON_HOME=~/Env" ~/.bashrc; then
    echo "export WORKON_HOME=~/Env" >> ~/.bashrc
fi
if ! grep --quiet "source /usr/local/bin/virtualenvwrapper.sh" ~/.bashrc; then
    echo "source `which virtualenvwrapper.sh`" >> ~/.bashrc
fi

if [ ! -d $WORKON_HOME/orthosie ]; then
    /bin/bash << SHELL
        export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
        export WORKON_HOME=~/Env
        source `which virtualenvwrapper.sh`
        mkvirtualenv orthosie
SHELL

fi
