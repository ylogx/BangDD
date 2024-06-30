package:
	zip -r BangDD-v0.2.0.zip *.js *.json *.md icons

lint:
	web-ext lint

install_deps:
	npm install --global web-ext
