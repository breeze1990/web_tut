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

    socket.on('newItem', function(data){
        if(data._method === "add")
            ItemManager.addItem(data._data);
    });

    socket.on('delItem', function(data) {
        ItemManager.remove(data._id);
    });

    socket.on('editItem', function(data) {
        if(data._method === "edit")
            ItemManager.update(data._data);
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

    function reqAdd() {
        socket.emit("reqAddItem");
    }

    function reqDel(opt) {
        socket.emit("reqDelItem", opt);
    }
    function reqEdit(data) {
        socket.emit("reqEditItem", data);
    }
    self.setName = setName;
    self.sendMsg = sendMessage;
    self.reqAdd = reqAdd;
    self.reqDel = reqDel;
    self.reqEdit = reqEdit;
    return self;
})();
