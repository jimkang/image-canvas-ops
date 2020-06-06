deploy:
	npm version patch && git push origin master && npm publish
