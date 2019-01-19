//var app = require('express')();
//var http = require('http').Server(app);

var io = require('socket.io')(4567, {
	transports: ['websocket'],
	origins: '*:*'
});

// io.origins('*:*');

//var io = require('socket.io')(80);

var users = [];
var usersOnline = 0;

io.on('connection', function(socket){
	console.log('conn!');
	
	socket.on('login', function(data) {
		var usr = new Client("player-" + usersOnline, usersOnline++, socket);
		
		socket.emit('loginCert', {user: usr, players: users});  // send back to socket
		socket.broadcast.emit('newPlayer', {user: usr});  // send to all other sockets of new player
		
		users.push(usr);
		console.log(usr);
	});
	
	socket.on('move', function(data) {
		console.log(data);
		
		for(var i = 0; i < users.length; i++) {
			if(users[i].id == data.id) {
				users[i].p_x = data.p_x;
				users[i].p_y = data.p_y;
				users[i].p_z = data.p_z;
				io.emit('move', { user: data});
				break;
			}
		}
	});

	socket.on('error', function(data) {
		console.log('<error>');
		console.log(data);
	});
});

function Client(user, id, sock) {
	this.username = user;
	this.id = id;
	this.socket = "sock";
	this.p_x = 0;
	this.p_y = 0;
	this.p_z = 0;
}

// io.listen(4567);
//http.listen(4567, function() { console.log('port 4567'); });
