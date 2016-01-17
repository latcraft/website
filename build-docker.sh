#!/bin/bash

set -e

sudo docker build --rm -t latcraft-website .

sudo docker tag -f latcraft-website latcraft/website
sudo docker push latcraft/website
