#!/bin/bash

set -e

function _usage {
  echo "Usage: build | serve | deploy [stage|live]"
  exit 0
}

function _say {
  echo ">> $@... <<"
}

function _install {
  _say "npm install" && \
  npm install
}

function _serve {
  _say "serve..." && \
  gulp $@
}

function _build {
  _say "build $@" && \
  gulp build $@
}

[[ $# -eq 0 ]] && _usage && exit 0

case "${1}" in
build)
  _install && _build
  ;;
serve)
  _serve
  ;;
deploy)
  _install && _build ${2:-"stage"}
  ;;
*)
  _usage
  ;;
esac

