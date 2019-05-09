FROM debian:jessie AS FRONT_DFC

MAINTAINER Courtel Eliot <eliot.courtel@wanadoo.fr>

RUN apt-get update && apt-get install curl -y
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install nodejs build-essential -y
RUN npm install -g http-server
RUN apt-get install git -y
RUN mkdir /home/front

ENTRYPOINT cd /home/front/ && \
	   if [ "$PROD" -eq 1 ];then mkdir prod; cd prod; git clone --quiet https://github.com/SCcagg5/DialogFlowMessenger > /dev/null; fi && \
	   cd ./DialogFlowMessenger/front-end/src && \
	   http-server -c31536000 ./ && /bin/bash
