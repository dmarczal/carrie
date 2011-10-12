PROJECT=$(shell pwd | awk -F/ '{print $$NF}')

all:
	@echo "\033[1;34mPulling ${PROJECT}...\033[0m"

	@git pull

pull: all

push:
	git pull
	git add .
	git commit -a
	git pull
	git push
