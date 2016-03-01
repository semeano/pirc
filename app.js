var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var connected = false;

io.on('connection', function (client) {
	if (!connected) {
		connected = true;

		console.log('Driver connected!');
		client.emit('connection', { status: true, message: 'Connected. Start driving!' });

	  client.on('disconnect', function () {
			console.log('Driver disconnect.');
			connected = false;
		});

		client.on('driving', function (driving) {
			console.log(driving);
		});
	}
	else {
		console.log('Another driver tried to connect.');
		client.emit('connection', { status: false, message: 'There\'s already a driver assigned.' });
	}
});

server.listen(3000, function () {
	console.log('Listening on port 3000...');
});