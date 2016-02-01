#!/bin/bash

set -e 

OUT_DIR=${1:-out}
COUNT=${2:-10}

mkdir -p $OUT_DIR
rm $OUT_DIR/* || true

for ((i=1; i<=$COUNT; i++)); 
do 
  _timestamp_=$(date +"%m-%d-%Y-%H_%M_%S")
  echo " -- RUN $i/$COUNT ($_timestamp_)"
  ./run.sh gulp clean 2>&1 1>/dev/null
  ./run.sh gulp build 2>&1 1>/dev/null
  _tmp_=$(mktemp)
  ls www/img/20??/*.png | xargs -I{} bash -c "echo cp {} ${OUT_DIR}/${_timestamp_}_\$(echo {} | sed 's:/:_:g')" | tee $_tmp_
  bash $_tmp_
done 
