TESTS = test/*.test.js
REPORTER = tap
TIMEOUT = 3000
MOCHA_OPTS =

install:
	@npm install --registry=http://registry.cnpmjs.org \
		--disturl=http://cnpmjs.org/dist

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

autod:
	@./node_modules/.bin/autod -w -e example --prefix=~ --keep=should
	@$(MAKE) install

.PHONY: test
