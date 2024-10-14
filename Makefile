package:
	zip -r BangDD-v0.2.2.zip *.js *.json *.md icons

lint:
	web-ext lint

install_deps:
	npm install --global web-ext
