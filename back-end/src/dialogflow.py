import requests
import json as JSON
import urllib

class dialogflowapi:
    def __init__(self, bearer, token, lang):
        self.bearer = bearer
        self.lang = lang
        self.token = token

    def talk(self, sentence):
        ret = self.__query(self.lang, sentence, self.token)
        return ret


    def __query(self, lang, query, id):
        url = "https://api.dialogflow.com/v1/query?v=20150910"
        url += "&lang=" + str(lang)
        url += "&" + urllib.parse.urlencode({"query":query})
        url += "&sessionId=" + str(id)
        res = requests.get(url, headers={'Authorization': 'Bearer ' + self.bearer})
        if res.status_code != 200:
            return [False, "invalid bearer ", 401]
        return [True, {"response": JSON.loads(res.text)["result"]["fulfillment"]["speech"]}, None]
