FROM debian:jessie AS BACK_DFC

MAINTAINER Courtel Eliot <eliot.courtel@wanadoo.fr>

RUN apt-get update && apt-get install curl -y
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install nodejs build-essential -y
RUN npm install -g pm2
RUN apt-get install python3 python3-pip -y
RUN apt-get install git -y
RUN pip3 install requests bottle uuid
RUN apt-get install openssh-client
RUN mkdir /home/api
RUN apt-get install nano

ENTRYPOINT cd /home/api/ && \
	   if [ "$PROD" -eq 1 ];then mkdir prod; cd prod; git clone --quiet https://github.com/SCcagg5/DialogFlowMessenger > /dev/null; fi && \
	   cd ./DialogFlowMessenger/back-end/src && pm2 start --interpreter python3 server.py --watch > /dev/null & > /dev/null;\
	   /bin/bash
