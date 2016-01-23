# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.33.10"

  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder "vagrant/nginx", "/etc/nginx/sites-available", create: true, owner: "root", group: "root"
  config.vm.synced_folder "vagrant/uwsgi", "/etc/uwsgi/apps-available", create: true, owner: "root", group: "root"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    # Comment-out or change the next line based on the CPU cores on your machine.
    vb.cpus = 2
  end

  config.vm.provision "file", source: "vagrant/uwsgi.conf", destination: "/home/vagrant/uwsgi.conf"
  config.vm.provision "file", source: "vagrant/orthosie.conf", destination: "/home/vagrant/orthosie.conf"
  config.vm.synced_folder "./", "/usr/share/nginx/orthosie/", owner: 109, group: 115, create: true
  config.vm.provision "update", type: "shell", path: "vagrant/update.sh"
  config.vm.provision "pip", type: "shell", path: "vagrant/pip.sh"
  config.vm.provision "virtualenv", type: "shell", path: "vagrant/virtualenv.sh", privileged: false
  config.vm.provision "django", type: "shell", path: "vagrant/django.sh", privileged: false
  config.vm.provision "nginx", type: "shell", path: "vagrant/nginx.sh"
  config.vm.provision "install", type: "shell", path: "vagrant/install.sh", privileged: false
  config.vm.provision "uwsgi", type: "shell", path: "vagrant/uwsgi.sh"
end
