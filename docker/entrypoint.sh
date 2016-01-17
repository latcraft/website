#!/bin/bash

set -e

function _usage {
  echo "Usage: npm | gulp [arguments]"
  exit 0
}

function _say {
  echo ">> $@... <<"
}


[[ $# -eq 0 ]] && _usage && exit 0

case "${1}" in
npm)
  _say npm ${@:2} && npm ${@:2}
  ;;
gulp)
  _say gulp ${@:2} && gulp ${@:2}
  ;;
*)
  _usage
  ;;
esac

