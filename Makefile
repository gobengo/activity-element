.PHONY: all build

all: build

build: node_modules lib

lib: node_modules
	./node_modules/bower/bin/bower install

dist: build src config/requirejs.conf.js
	./node_modules/requirejs/bin/r.js -o ./config/build.conf.js	

css: build
	lessc demos/main/main-styles.css > demos/main/index.css

watch: build
	./node_modules/.bin/watchify -s activity-element  -t brfs src/index.js -o dist/activity-element.js

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

server: build
	npm start

test: build
	# uses karma start
	npm test

clean:
	rm -rf node_modules lib dist

package: dist

env=dev
deploy: dist
	./node_modules/.bin/lfcdn -e $(env)

