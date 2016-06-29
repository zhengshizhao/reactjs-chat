// this socket object to send messages to our server 
var socket = io(window.location.origin); 

socket.on('connect', function(){

  console.log('two-way connection to the server!');   
    
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	 });
	socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
	});
})

