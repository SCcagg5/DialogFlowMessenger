# Messenger like & DialogFlow app ( w/ sentiment analysis)
---

# The App:
To launch the app use: `docker-compose up -d --build` from inside the git directory

 * _This app include sentiments analysis through https://github.com/SCcagg5/DialogFlowSentimentAnalyser 's API see More_

### Tech :
 
  * **APP**: Docker
  * **FRONT**: /
  * **END**: Python3
  
  
---

# Back end:

### Route:  

Route| Method| Content Type |Parameters| Description |
:-|:-:|:-:|:-:|:-|
/test/ | POST, GET |  |  | return an empty response pattern
/talk/ | POST | JSON | sentence, lang, token, bearer | return response of the dialogflow app selected by bearer

### Parameters:
```javascript
{
  "sentence" : "*YOUR TEXT*",
  "lang": "YOUR_LANG", // ["fr", "en"]
  "token": "USER'S TOKEN" //if NULL the app return a new one,
  "bearer" : "*YOUR_DIALOGFLOW_BEARER*",
}
```

**Warning**: 
  * the `token` parameter is changed every new call
  * the first part (before the `_`) should'nt change, if it does change report bug

### Launching the App:  

From inside the `back-end` dir:

 * `docker build -t msgr_back_img .`
 * `docker run --detach --name dialogCorrect -p5000:8080 -it msgr_back_img`

### More

To enable sentiment analysis:

* _`git clone https://github.com/SCcagg5/DialogFlowMessenger`_
* _`git clone https://github.com/SCcagg5/DialogFlowSentimentAnalyser`_
* _`cp ./DialogFlowMessenger/docker-compose_enbl_sent.yml ./docker-compose.yml`_
* _store your `GOOGLE_APPLICATION_CREDENTIALS.json` inside DialogFlowSentimentAnalyser's directory_
* _`docker-compose up -d --build`_

You can now:

* _ping the Mesenger's API using `localhost:5001` _
* _ping the Sentiments's API using `localhost:5000` _

And Sentiment analysis is included in the Messenger's API response
