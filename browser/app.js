// this socket object to send messages to the server 
var socket = io(window.location.origin); 
 
socket.on('connect', function(){

  socket.on('user', function(massege){
  		$('#messages').append($('<span>').text(massege));
	})

  socket.on('type', function(typing){
	$('#m').attr("placeholder", typing);
   });

  socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
   });

 // console.log('two-way connection to the server!');   
    
	$('form').submit(function(){
		socket.emit('chat message',$('#m').val());
    socket.emit('type', '')
		$('#m').val('');

		return false;
	 });

    $('input').click(function(){
             
      socket.emit('type', 'is typing...')
      
      $('input').keydown(function(){
          socket.emit('type', 'is typing...')
      })
      return false;
    });
  
    

})

