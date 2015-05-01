var serverConn = (function(){
    "use strict";
    var self = {};

    var socket = io();

    socket.on('msgFromUser', function(data) {
        console.log(data + "received");
        var c = $('.user-chat').val();
        $('.user-chat').val(c+"\n"+data);
    });

    socket.on('userList', function(data){
        // console.log(data);
        $('.user-list').val(data.toString());
    });
    // socket.emit("setName","Anonymous");
    function setName(name){
        if(!name) name = "noname";
        // console.log(name+ ' sent to server');
        socket.emit("setName",name);
    }

    function sendMessage(msg) {
        socket.emit("userMsg",msg);
    }
    self.setName = setName;
    self.sendMsg = sendMessage;
    return self;
})();
