var app = require('express')();
var server = require('http').Server(app);
var serveStatic = require('serve-static');
var fs = require('fs');
var io = require('socket.io')(server);

var sockets = [];

app.use(serveStatic('public'))

server.listen(8080)

console.log("Server listening at http://localhost:8080");


io.on('connection', function(socket){
  sockets.push(socket);
  console.log('a user connected');
  socket.on('disconnect', function () {
      var index = sockets.indexOf(socket);
      console.log('a user disconnected');
      sockets.splice(index, 1);
  });
});

fs.watch('public', function(event, filename) {
  console.log('file changed ' + filename);
  sockets.forEach(function (socket) {
    socket.emit('filechange', filename);
  });
});

console.log("Watching folder lib for changes");
