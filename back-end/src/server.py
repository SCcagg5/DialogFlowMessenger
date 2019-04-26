from bottle import run, route, get, post, response, request, hook
import time
from returnvalue import ret
from params import check
from dialogflow import dialogflowapi
from analyse import sentiment
import uuid
import os

"""route to test if api is up"""
@get('/test/')
@post('/test/')
def base():
    try:
        params = check.json(request)
    except:
        params = []
    toret = ret(request.route.rule, params)
    return toret.ret()

@post('/talk/')
def base():
    try:
        params = check.json(request)
    except:
        params = []
    toret = ret(request.route.rule, params)

    if not toret.err:
        err = check.contain(params, ["bearer", "sentence", "token", "lang"])
        if not err[0]:
            toret.add_error(err[1], err[2])

    if not toret.err:
        sent = sentiment(params["token"], params["lang"])
        err = sent.talk(params["sentence"])
        if not err[0]:
            toret.add_error(err[1], err[2])
        else:
            toret.add_data(err[1])
            token = err[1]["user"]["token"].split('_')[0]

    if not toret.err:
        df = dialogflowapi(params["bearer"], token, params["lang"])
        err = df.talk(params["sentence"])
        if not err[0]:
            toret.add_error(err[1], err[2])
        else:
            toret.data["data"]["response"] = err[1]["response"]

    return toret.ret()

if __name__ == '__main__':
        try:
            run(host='0.0.0.0', port=8080)
        except:
            os._exit(0)
