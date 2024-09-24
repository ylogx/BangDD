package:
	zip -r BangDD-v0.2.1.zip *.js *.json *.md icons

lint:
	web-ext lint

install_deps:
	npm install --global web-ext
