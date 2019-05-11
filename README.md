# Messenger like & DialogFlow app ( w/ sentiment analysis)

[![CodeFactor](https://www.codefactor.io/repository/github/sccagg5/dialogflowmessenger/badge)](https://www.codefactor.io/repository/github/sccagg5/dialogflowmessenger)
[![codebeat badge](https://codebeat.co/badges/861fa6b1-def4-4b0f-98b4-79977d84bf33)](https://codebeat.co/projects/github-com-sccagg5-dialogflowmessenger-master)
[![BCH compliance](https://bettercodehub.com/edge/badge/SCcagg5/DialogFlowMessenger?branch=master)](https://bettercodehub.com/)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/eliotctl/dialogflowmessenger-frnt.svg?label=docker%20front-end)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/eliotctl/dialogflowmessenger-back.svg?label=docker%20back-end)

# The App:
To launch the app use: `docker-compose up -d --build` from inside the git directory

 * _This app include sentiments analysis through https://github.com/SCcagg5/DialogFlowSentimentAnalyser 's API see More_
 * _Exemple at http://eliotctl.fr/DialogFlowMessenger/_

### Tech :
 
  * **APP**: Docker
  * **FRONT**: vuejs
  * **END**: Python3
  
  
---

# Back end:

### Route:  

Route| Method| Content Type |Parameters| Description |
:-|:-:|:-:|:-:|:-|
/test/ | POST, GET |  |  | return an empty response pattern
/talk/ | POST | JSON | sentence, lang, token, bearer, analysis | return response of the dialogflow app selected by bearer

### Parameters:
```javascript
{
  "sentence" : "*YOUR TEXT*",
  "lang": "YOUR_LANG", // ["fr", "en"]
  "token": "USER'S TOKEN" //if NULL the app return a new one,
  "bearer" : "*YOUR_DIALOGFLOW_BEARER*",
  "analysis": True / False // enable/disable sentiment analysis
}
```

**Warning**: 
  * the `token` parameter is changed every new call **if Sentiments's API is enabled**
  * the first part (before the `_`) should'nt change, if it does change report bug
# Front end:


### Setup:

In the `app.js` file you'll have to modify the users array: 

```javascript
"bot": { //name
  "online": true, //online state 
  "img": "./img/avatar.png",  //image of the user
  "name": "DialogFlow Helper",  // displayed name
  "desc": "Here to help you !",  //short description under the user
  "psd": "bot",  //name
  "func": "bot", //['bot', 'human'] 
  "bearer": "580132fb72ca4f7d85d41fbd63f2f498" //dialogflow bearer
}
```

WARN: your dialogflow should have an `en` and `fr` version

### Launching the App:  

From inside the `back-end` dir:

 * `docker build -t msgr_back_img .`
 * `docker run --detach --name dialogCorrect -p5000:8080 -it msgr_back_img`

### More

To enable sentiment analysis:

* _`git clone https://github.com/SCcagg5/DialogFlowMessenger`_
* _`git clone https://github.com/SCcagg5/DialogFlowSentimentAnalyser`_
* _`cp ./DialogFlowMessenger/docker-compose_full.yml ./docker-compose.yml`_
* _store your `GOOGLE_APPLICATION_CREDENTIALS.json` inside DialogFlowSentimentAnalyser's directory_
* _`docker-compose up -d --build`_

You can now:

* *ping the Mesenger's API using `localhost:5001`*
* *ping the Sentiments's API using `localhost:5000`*

And Sentiment analysis is included in the Messenger's API response
