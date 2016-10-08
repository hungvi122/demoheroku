var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	nicknames = [];
	app.set('port', (process.env.PORT || 5000));
	app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

	//app.set('port', (process.env.PORT || 5000));
	server.listen(3000);
	app.use(express.static(__dirname));
	app.get('',function(req,res){
		res.sendfile(__dirname + '/index.html');
	});

io.sockets.on('connection',function(socket){
	socket.on('new user',function(data,callback){
		if(nicknames.indexOf(data)!= -1){
			callback(false);
		}else{
			callback(true);
			socket.nickname= data;
			nicknames.push(socket.nickname);
			updateNickname();
		}
	});
	function updateNickname(){
		io.sockets.emit('usernames',nicknames);
	}
	socket.on('send message',function(data){
		io.sockets.emit('new message', data);
		socket.broadcast.emit('new message',data);
	});
	socket.on('disconnect', function(data){
		if(!socket.nickname)return;
		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		updateNickname();

	});
	
});