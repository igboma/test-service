dependencies:
	npm install

run: dependencies
	node server.js

clean:
	@rm -fr node_modules

.PHONY: dependencies run clean
