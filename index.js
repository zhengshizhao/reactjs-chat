var path = require('path');
var http = require('http');
var server = http.createServer();
var express = require('express');
var app = express();
var React = require('react');

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
var sokect = require('./routes/socket.js')
io.on('connection', sokect)

var port = 3000;
server.listen(port, function () {
    console.log('The server is listening on port ', port);
});

