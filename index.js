var path = require('path');
var http = require('http');
var server = http.createServer();
var express = require('express');
var app = express();

var socketio = require('socket.io'); 

server.on('request', app);

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/browser/index.html'));
});
// creates a new connection server for web sockets and integrates it into HTTP server 
var io = socketio(server);
// use socket server as an event emitter in order to listen for new connctions
io.on('connection', function(socket){
  //receives the newly connected socket
	console.log(socket.id + ' has connected');
	socket.broadcast.emit('user','A new user is online');
  //disconnect 
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected.'); 
  })

  socket.on('chat message', function(msg){
  	// console.log("msg", msg);
    io.emit('chat message', msg);
  });

  socket.on('type', function(typing){
  	socket.broadcast.emit('type', typing);
  })

})

var port = 3000;
server.listen(port, function () {
    console.log('The server is listening on port ', port);
});

