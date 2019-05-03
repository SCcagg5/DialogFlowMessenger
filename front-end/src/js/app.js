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
       no_av: {"fr": "Désolé, je ne suis pas disponible pour le moment", "en": "Sorry, I'm not available for the moment"},
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
      adddestmsg: function(dest, text, lang){
        this.conv[dest][lang].push({"msg": text, "user": "dest"});
        message = '<div class="col-message-received"><div class="message-received"><p>'+text+'</p></div></div>'
        this.addhtmlmsg(dest, message, lang);
      },
      addusermsg: function(dest, text){
        this.conv[dest].push({"msg": text, "user": "user"});
        message = '<div class="col-message-sent"><div class="message-sent"><p>'+text+'</p></div></div>';
        this.addhtmlmsg(dest, message, this.lang);
        this.sendmsgdest(dest, text, this.lang);
      },
      addhtmlmsg: function(dest, html, lang) {
        this.rawMessages[dest][lang] += html;
        this.update();
        this.$nextTick(function () {this.scrolldown()});
      },
      sendmsgdest: function(dest, text, lang) {
        if (this.users[dest] == void 0)
          return;
        if (this.users[dest]["online"] == true){
            if (this.users[dest]["func"] == "bot")
               this.callbot(dest, text, this.currentDest["bearer"], lang);
        }else {
          this.adddestmsg(dest, this.no_av[lang], lang);
        }
      },
      callbot: function(dest, text, bearer, lang, analysis){
        this.ajaxRequest = true;
        data = {
          "token": this.token,
          "sentence": text,
          "lang": lang,
          "bearer": bearer,
          "analysis": analysis
        }
        url = "http://localhost:5000/talk/"
        axios.post(url, data)
             .then(response => {this.formatbotresp(dest, response, lang, analysis)})
             .catch(error => console.log(error));
      },
      formatbotresp: function(dest, response, lang, a){
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
        this.token = response.data.data.user.token;
        this.adddestmsg(dest, text, lang);
      },
      switchdest: function(dest) {
        if (this.users[dest] == void 0)
          return;
        this.currentDest = this.users[dest];
        this.update();
      },
      update: function() {
        this.setupConv(false);
        dest = this.currentDest.psd
        if (this.rawMessages[dest] != void 0){
          this.print = this.rawMessages[dest][this.lang];
          if (this.users[dest]["func"] != "bot" && !this.users[dest]["online"]) {
            if (this.print.trim() == '')
            this.print += '<div class="wrapper-mobile" style="display: block; height: 100%; position: static;"><div class="mobile"><img src="./img/lone-logo.svg">'+this.no_av[this.lang]+'</div></div>'
          }
        }
        else {
          this.print = '';
        }
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
        this.token = "";
        this.setupConv(true);
        this.update();
        this.loadtoken(localStorage.token);
        this.callBots();
      },
      sendmsg: function() {
        if (this.typemsg.trim().length != 0)
          this.addusermsg(this.currentDest.psd, this.typemsg, this.lang);
        this.typemsg = "";
      },
      scrolldown: function() {
        var container = this.$refs.chat;
        container.scrollTop = container.scrollHeight;
      },
      setupConv: function(fullreset) {
        for (var dest in this.users){
          if (this.rawMessages[dest] == void 0 || fullreset) {
            this.rawMessages[dest] = {};
            for (var lang in this.langues)
              this.rawMessages[dest][lang] = '';
          }
          if (this.conv[dest] == void 0 || fullreset) {
            this.conv[dest] = [];
            for (var lang in this.langues)
              this.conv[dest][lang] = [];
          }
        }
      },
      callBots: function() {
        for(var dest in this.users)
          if (this.users[dest]["func"] == "bot")
            for (var lang in this.langues) {
              this.callbot(dest, "hello", this.users[dest]["bearer"], lang, false);
            }
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
            this.$refs.input.focus();
        this.switchdest(this.currentDest.psd);
      } else {
        this.setupConv(true);
        this.switchdest("bot");
        this.callBots();
      }

    }
})

//
