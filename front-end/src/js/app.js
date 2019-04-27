new Vue({
    el: '#app',
    data: {
       ajaxRequest: false,
       rawMessages: {},
       conv: {},
       currentDest: {"online": false, "img": "", "name": "", "desc": "", "psd": ""},
       print: '',
       users: {"bot": {"online": true, "img": "./img/avatar.png", "name": "DialogFlow Helper", "desc": "Here to help you !", "psd": "bot", "func": "bot", "bearer": "580132fb72ca4f7d85d41fbd63f2f498"},
                "bottest": {"online": true, "img": "./img/avatar.png", "name": "Talker", "desc": "Here to talk !", "psd": "bottest", "func": "bot", "bearer": "54bda7f79cb348fa9039fdcbc9bf47f1"},
               "center": {"online": false, "img": "./img/avatar-2.png", "name": "Help Center", "desc": "Be there soon.", "psd": "center", "func": "human"}},
       typemsg: "",
       token: '',
       lang: "fr",
       langue: "Francais",
       langues: {"fr": [{"langue": "Francais", "lang": "fr"}, {"langue": "Anglais", "lang": "en"}], "en": [{"langue": "French", "lang": "fr"}, {"langue": "English", "lang": "en"}]},
       humeurs: {"fr": [["Négative", "Neutre", "Positive"], ["Négatif", "Neutre", "Positif"]], "en": [["Negative", "Neutral", "Positive"], ["Negative", "Neutral", "Positive"]]},
       youre: {"fr": ["La conversation est pour le moment: ", "Votre dernier message était :"], "en": ["The conversation is for the moment : ", "Your last message was:"]},
       humeur: 50,
       lastscore: 50,
       sent_api_on: false,
    },
    watch: {
      typemsg: function() {
        localStorage.typemsg = this.typemsg;
      },
      lang: function(){
        for (i = 0; i < this.langues[this.lang].length; i++){
          if (this.langues[this.lang][i]["lang"] == this.lang)
            this.langue = this.langues[this.lang][i]["langue"];
            this.update();
        }
      }
    },
    filters: {
      float2: function(number){
        return number.toFixed(0)
      }
    },
    methods: {
      adddestmsg: function(dest, text){
        if (this.conv[dest] == void 0)
          this.conv[dest] = [];
        this.conv[dest].push({"msg": text, "user": "dest"});
        message = '<div class="col-message-received"><div class="message-received"><p>'+text+'</p></div></div>'
        this.addhtmlmsg(dest, message);
      },
      addusermsg: function(dest, text){
        if (this.conv[dest] == void 0)
          this.conv[dest] = [];
        this.conv[dest].push({"msg": text, "user": "user"});
        message = '<div class="col-message-sent"><div class="message-sent"><p>'+text+'</p></div></div>';
        this.addhtmlmsg(dest, message);
        this.sendmsgdest(dest, text);
      },
      addhtmlmsg: function(dest, html) {
        if (this.rawMessages[dest] == void 0)
          this.rawMessages[dest] = '';
        this.rawMessages[dest] += html;
        this.update();
        this.$nextTick(function () {this.scrolldown()});
      },
      sendmsgdest: function(dest, text) {
        if (this.users[dest] == void 0)
          return;
        if (this.users[dest]["func"] == "bot")
          this.callbot(dest, text, this.currentDest["bearer"])
      },
      callbot: function(dest, text, bearer){
        this.ajaxRequest = true;
        data = {
          "token": this.token,
          "sentence": text,
          "lang": this.lang,
          "bearer": bearer
        }
        url = "https://eliotctl.fr/api/dialogflowmessenger/talk/"
        axios.post(url, data)
             .then(response => {this.formatbotresp(dest, response)})
             .catch(error => console.log(error));
      },
      formatbotresp: function(dest, response){
        if (response.data.status != 200)
          return;
        text = response.data.data.response
        if (response.data.data.user.score != void 0) {
          this.humeur = (response.data.data.user.score + 1) * 50
          this.lastscore = (response.data.data.score + 1 ) * 50
          this.sent_api_on = true
        } else {
          this.sent_api_on = false
        }
        this.token = response.data.data.user.token
        this.adddestmsg(dest, text)
      },
      switchdest: function(dest) {
        if (this.users[dest] == void 0)
          return;
        if (this.rawMessages[dest] == void 0)
          this.rawMessages[dest] = '';
        this.currentDest = this.users[dest];
        this.update();
      },
      update: function() {
        this.print = this.rawMessages[this.currentDest.psd];
        localStorage.currentDest = JSON.stringify(this.currentDest);
        localStorage.rawMessages = JSON.stringify(this.rawMessages);
        localStorage.typemsg = this.typemsg;
        localStorage.token = this.token;
        localStorage.lang = this.lang;
        localStorage.history = true;
      },
      loadtoken: function(token){
        this.token = token;
        token = token.split("_");
        if (token[1])
          this.humeur = (parseFloat(token[1]) + 1) * 50
        else {
          this.humeur = 50
        }
        this.lastscore = -1
      },
      reset: function(){
        this.rawMessages = {}
        this.token = ""
        this.update();
        this.loadtoken(localStorage.token);
        this.adddestmsg("bottest", "Bonjour ! Je suis la pour tester ce système, tu peux me parler de tout et de rien");
        this.adddestmsg("bot", "Salut ! Je suis la pour t’assister dans ton apprentissage de DialogFlow, n’hésite pas a me poser des questions");
      },
      sendmsg: function() {
        this.addusermsg(this.currentDest.psd, this.typemsg);
        this.typemsg = "";
      },
      scrolldown: function() {
        var container = this.$refs.chat;
        container.scrollTop = container.scrollHeight;
      }
    },
    mounted(){
      if (localStorage.history) {
        this.rawMessages = JSON.parse(localStorage.rawMessages);
        this.currentDest = JSON.parse(localStorage.currentDest);
        this.typemsg = localStorage.typemsg;
        this.sent_api_on = true;
        this.lang = localStorage.lang;
        this.loadtoken(localStorage.token);
        if (this.typemsg != "")
          this.$refs.input.focus()
        this.switchdest(this.currentDest.name)
      } else {
        this.adddestmsg("bottest", "Bonjour ! Je suis la pour tester ce système, tu peux me parler de tout et de rien");
        this.adddestmsg("bot", "Salut ! Je suis la pour t’assister dans ton apprentissage de DialogFlow, n’hésite pas a me poser des questions");
        this.switchdest("bot")
      }

    }
})

//
