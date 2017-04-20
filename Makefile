MAKEFLAGS = -j1

export NODE_ENV = test

.PHONY: lint clean test-only test bootstrap

lint:
	./scripts/lint.sh

clean:
	rm -rf node_modules
	rm -rf packages/*/node_modules

test: lint
	./scripts/test.sh

bootstrap:
	make clean
	npm i
	./node_modules/.bin/lerna bootstrap

test-ci-coverage:
	BABEL_ENV=cov make bootstrap
	./scripts/test-cov.sh
	./node_modules/.bin/codecov -f coverage/coverage-final.json
