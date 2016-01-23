#!/usr/bin/env bash
apt-get update
apt-get -y dist-upgrade
apt-get -y autoremove
apt-get clean
