#!/bin/bash

set -e

docker run --rm -it -v ${PWD}:/app -v ${HOME}/.ssh/id_rsa:/root/.ssh/id_rsa  -p 9009:9009 -p 35729:35729 -e GH_TOKEN=${GH_TOKEN} --name latcraft-website latcraft/website $@
