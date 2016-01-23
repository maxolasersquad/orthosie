#!/usr/bin/env bash
/bin/bash << SHELL
    export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
    export WORKON_HOME=~/Env
    source `which virtualenvwrapper.sh`
    workon orthosie
    pip install django
SHELL
