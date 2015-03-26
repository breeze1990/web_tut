var express = require('express');
var path = require('path');
var http = require('http');
var router = express();

router.use(express.static(path.resolve(__dirname, 'client'), {index:'comments.html'}));

var server = http.createServer(router);
server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
