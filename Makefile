build:
	npx tsc

package: build
	zip -r BangDD-v0.3.0.zip dist manifest.json *.md icons

lint:
	npx tsc --noEmit
	npx eslint .
	web-ext lint

install_deps:
	npm install
	npm install --global web-ext
