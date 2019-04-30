import requests
import json as JSON
import urllib
import uuid

class sentiment:
    def __init__(self, token = None, lang = None):
        self.lang = lang
        self.token = token

    def talk(self, sentence):
        ret = self.__query(self.lang, sentence)
        return ret

    def checktoken(self, tok):
        if tok is None or len(tok.split('_')) is not 3:
            id = str(uuid.uuid4()).replace('-', '')
            token = id + "_0.0_0"
        else:
            token = tok
        return [True, {"user":{"token" : token}}, 200]

    def __query(self, lang, query):
        url = "http://dialogflow_sentiment_api:8080/sentence/"
        headers = {
                'Content-Type': "application/json",
                'cache-control': "no-cache",
                }
        data = {
        	"token": self.token,
        	"sentence": query,
        	"lang": lang
        }
        payload = JSON.dumps(data)
        try:
            res = requests.request("POST", url, data=payload, headers=headers)
            if res.status_code != 200:
                return [False, "invalid token ", 401]
            return [True, JSON.loads(res.text)["data"], None]
        except:
            tok = str(uuid.uuid4()).replace('-', '')
            if self.token is not None:
                token = self.token.split('_')
                if len(token) is 3:
                    tok = token[0]
            token = tok + '_0.0_1'
            return [True, {"info": "'dialogflow_sentiment_api' isn't connected", "user":{"token" : token} }, None]
