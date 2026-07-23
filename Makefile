.PHONY: all build watch package lint install_deps clean distclean

all: build

build:
	npx tsc

watch:
	npx tsc --watch

package: build
	zip -r BangDD-v0.3.0.zip dist manifest.json *.md icons

lint:
	npx tsc --noEmit
	npx eslint .
	web-ext lint

install_deps:
	npm install
	npm install --global web-ext

clean:
	rm -rf dist *.tsbuildinfo

distclean: clean
	rm -rf node_modules
