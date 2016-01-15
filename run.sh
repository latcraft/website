#!/bin/bash

set -e

sudo docker run --rm -it -v ${PWD}:/app -p 9009:9009 -p 35729:35729 latcraft-website $@
