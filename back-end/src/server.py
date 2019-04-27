from bottle import Bottle, run, route, get, post, response, request, hook
from returnvalue import ret
from params import check
from dialogflow import dialogflowapi
from analyse import sentiment
import os

app = Bottle()

@app.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

"""route to test if api is up"""
@app.get('/test/')
@app.post('/test/')
def base():
    try:
        params = check.json(request)
    except:
        params = []
    toret = ret(request.route.rule, params)
    return toret.ret()

@app.post('/talk/')
@app.get('/talk/')
def base():
    if request.method == 'OPTIONS':
        return {}
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
