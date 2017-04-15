#!/bin/sh
set -e

for f in packages/*; do
  echo $f
  cd $f
  npm run lint
  if [ $? -ne 0 ]; then
    exit 1
  fi
  cd -> /dev/null
done
