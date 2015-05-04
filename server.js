var express = require('express');
var params = require('express-params')
var path = require('path');
var http = require('http');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var async = require('async');
var HashMap = require('hashmap');
var shortid = require('shortid');

var router = express();
params.extend(router);

var sockets = [];
var notes_data = {};

var data_url = 'http://breeze1990.appspot.com/save';

var noteMap = new HashMap();

request.get(data_url,function(err,res,body){
    notes_data = JSON.parse(body);
    console.log('data received');
});

router.use(function(req,res,next){
    // console.log('request: ' + new Date().toString());
    next();
})
router.use('/old',express.static(path.resolve(__dirname, 'client'), {index:'comments.html'}));
router.use('/',express.static(path.resolve(__dirname, 'main')));

// router.param('id', /^\d+$/);
router.get('/main/:user/:id([0-9]+)', function(req,res){


    res.set({ 'content-type': 'application/json; charset=utf-8' })
    res.end("Hello " + JSON.stringify(req.params));
});

router.get(/^\/(test|demo)\/(\d+)\.\.(\d+)$/, function(req,res){
    console.log(req.params);
    res.end("received");
});


var server = http.createServer(router);
server.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var io = require('socket.io')(server);

io.on('connection',function(socket){
  sockets.push(socket);
  socket.name = "User";

  bdUsers();
  // console.log('A user connected.');
  socket.on('disconnect',function(){
    rm_socket(socket);
    console.log((socket.name || 'A user') + ' disconnected.');
});

  socket.on('rq_notes_data',function(data){
      socket.emit('notes',notes_data);
  });
  socket.on('setName',function(data){
    if(!data) return;
    console.log(socket.name + " changed to " + data);
    socket.name = data;
    bdUsers();
});

  socket.on('save_data',function(data){
      //console.log(data);
      notes_data = data;
      var req={};
      req.url = data_url;
      req.body = 'op=clear';
      request.post(req); // clear existed data
      for(var it in data){
          var nt = {};
          nt.content = data[it].content;
          nt.color = data[it].color;
          nt.left = data[it].left;
          nt.top = data[it].top;
          req.body = querystring.stringify(nt);
          request.post(req);
      }
  });

  socket.on('userMsg', function(data){
      console.log(data + " from " + socket.name);
      broadcastFrom(socket,"msgFromUser",socket.name+": "+data);
  });

  socket.on('reqAddItem', function(data) {
      var iid = shortid.generate();
      while(noteMap.get(iid)!==undefined) iid = shortid.generate();
      var ndata = {};
      ndata._id = iid;
      ndata.ititle = "noname";
      ndata.icontent = "Hello user";
      ndata.itop = "100px";
      ndata.ileft = "100px";
      noteMap.set(iid, ndata);
      broadcastFrom(null, "newItem", { _data: ndata, _method: "add" } );
  });

  socket.on('reqDelItem', function(data) {
      var did = data._id;
      noteMap.remove(did);
      broadcastFrom(socket, "delItem", { _id: did } );
  });

  socket.on('reqEditItem', function(data) {
      broadcastFrom(socket, "editItem", { _data: data, _method: "edit" });
  });
})

function rm_socket(socket){
  sockets.splice(sockets.indexOf(socket),1);
}

function broadcastFrom(socket, ename, data) {
    async.each(sockets,
        function(sct,callback){
            if(sct==socket) return;
            sct.emit(ename, data);
        }, null );
}

function bdUsers(){
    async.map(sockets, function(s, cb){
        cb(null, s.name);
    }, function(err, res){
        broadcastFrom(null, "userList", res);
    });
}
