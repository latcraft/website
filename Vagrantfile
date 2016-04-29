
# NOTE: Use Vagrant 1.7.4+

$provision_script = <<SCRIPT

# Fix error: unable to re-open stdin: No file or directory
export DEBIAN_FRONTEND=noninteractive
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
sudo locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales

# Install Docker
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo mkdir -p /etc/apt/sources.list.d
sudo su -c "echo deb https://apt.dockerproject.org/repo ubuntu-trusty main > /etc/apt/sources.list.d/docker.list"
sudo apt-get update -q -y

# Setup AUFS
sudo apt-get -y install linux-image-extra-$(uname -r)
sudo apt-get install -y -q docker-engine
sudo usermod -aG docker vagrant

# Setup Docker Compose
sudo su -c "curl -sSL https://github.com/docker/compose/releases/download/1.4.0/docker-compose-Linux-x86_64 > /usr/local/bin/docker-compose"
sudo chmod +x /usr/local/bin/docker-compose

SCRIPT

Vagrant.configure("2") do |config|
  
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "docker-dev"
  config.vm.network "private_network", ip: "192.168.111.201"

  config.vm.provider "virtualbox" do |vb|

    # Increase VM memory to 2GB.
    vb.customize ["modifyvm", :id, "--memory", "2048"]
    
    # Resolve names using host DNS, so we could connect to private/VPN protected hosts.
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]

  end

  config.vm.provision "shell", inline: $provision_script

end


