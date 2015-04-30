var express = require('express');
var params = require('express-params')
var path = require('path');
var http = require('http');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var router = express();
params.extend(router);

var sockets = [];
var notes_data = {};

var data_url = 'http://breeze1990.appspot.com/save';

request.get(data_url,function(err,res,body){
    notes_data = JSON.parse(body);
    console.log('data received');
});

router.use('/old',express.static(path.resolve(__dirname, 'client'), {index:'comments.html'}));
router.use('/',express.static(path.resolve(__dirname, 'main')));

router.param('id', /^\d+$/);
router.get('/main/:user/:id', function(req,res){
    res.end("Hello " + req.params.user + " " + req.params.id);
});




var server = http.createServer(router);
server.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var io = require('socket.io')(server);

io.on('connection',function(socket){
  sockets.push(socket);
  console.log('A user connected.');
  socket.on('disconnect',function(){
    rm_socket(socket);
    console.log((socket.name || 'A user') + ' disconnected.');
  })

  socket.on('rq_notes_data',function(data){
      socket.emit('notes',notes_data);
  })
  socket.on('setName',function(data){
    if(!data) socket.name = 'Guest';
    else socket.name = data;
  })

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
  })
})

function rm_socket(socket){
  sockets.splice(sockets.indexOf(socket),1);
}
