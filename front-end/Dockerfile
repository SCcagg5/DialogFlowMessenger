FROM debian:jessie AS FRONT_DFC

MAINTAINER Courtel Eliot <eliot.courtel@wanadoo.fr>

RUN apt-get update && apt-get install curl -y
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install nodejs build-essential -y
RUN npm install -g http-server
RUN apt-get install git -y
RUN mkdir /home/front

ENTRYPOINT cd /home/front/ && \
	   git clone --quiet https://github.com/SCcagg5/DialogFlowAutoCorrect > /dev/null && \
	   cd ./DialogFlowAutoCorrect/front-end/src && \
	   http-server ./ && /bin/bash