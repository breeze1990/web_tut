var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var router = express();

var sockets = [];
var notes_data = {};
var data_file = 'content.txt';

notes_data = JSON.parse(fs.readFileSync(data_file));

router.use(express.static(path.resolve(__dirname, 'client'), {index:'comments.html'}));

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
      fs.writeFile(data_file,JSON.stringify(data),function(err){
          if(err){
              console.log('err happens ' + err);
          }
          console.log(data);
          console.log('write to file');

      });
  })
})

function rm_socket(socket){
  sockets.splice(sockets.indexOf(socket),1);
}
