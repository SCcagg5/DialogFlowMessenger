new Vue({
    el: '#app',
    data: {
       rawMessages: {},
       conv: {},
       currentDest: {"online": false, "img": "", "name": "", "desc": "", "psd": ""},
       print: '',
       users: {"bot": {"online": true, "img": "./img/avatar.png", "name": "DialogFlow Helper", "desc": "Here to help you !", "psd": "bot"},
               "center": {"online": false, "img": "./img/avatar-2.png", "name": "Help Center", "desc": "Be there soon.", "psd": "center"}},
       typemsg: ""
    },
    watch: {
      typemsg: function() {
        localStorage.typemsg = this.typemsg;
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
      },
      addhtmlmsg: function(dest, html) {
        if (this.rawMessages[dest] == void 0)
          this.rawMessages[dest] = '';
        this.rawMessages[dest] += html;
        this.update();
        this.$nextTick(function () {this.scrolldown()});
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
        localStorage.history = true;
      },
      sendmsg: function() {
        this.addusermsg(this.currentDest.psd, this.typemsg);
        this.typemsg = "";
      },
      scrolldown: function() {
        var container = this.$refs.chat;
        container.scrollTop = container.scrollHeight;
        console.log("lol");
      }
    },
    mounted(){
      if (localStorage.history) {
        this.rawMessages = JSON.parse(localStorage.rawMessages);
        this.currentDest = JSON.parse(localStorage.currentDest);
        this.typemsg = localStorage.typemsg;
        if (this.typemsg != "")
          this.$refs.input.focus()
        this.switchdest("bot")
      } else {
        this.adddestmsg("bot", "Hello, je suis un Chatbot fait pour vous assister dans votre apprentissage n'hesitez pas à me poser des questions");
        this.switchdest("bot")
      }

    }
})

//
