#!/bin/sh
set -e

node_modules/.bin/nyc node_modules/mocha/bin/_mocha --recursive --opts test/mocha.opts `scripts/_get-test-directories.sh`
node_modules/.bin/nyc report --reporter=json
