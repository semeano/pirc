var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var gpio = require('rpi-gpio');

app.use(express.static('public'));

var connected = false;

io.on('connection', function (client) {
	if (!connected) {
		connected = true;

		console.log('Driver connected!');
		client.emit('connection', { status: true, message: 'Connected. Start driving!' });

		gpioSetup();

		client.on('disconnect', function () {
			console.log('Driver disconnect.');
			gpio.destroy();
			connected = false;
		});

		client.on('driving', function (driving) {
			console.log(driving);
			drive(driving);
		});
	}
	else {
		console.log('Another driver tried to connect.');
		client.emit('connection', { status: false, message: 'There\'s already a driver assigned.' });
	}
});

function gpioSetup() {
	gpio.setup(7, gpio.DIR_OUT, function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.setup(11, gpio.DIR_OUT, function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.setup(13, gpio.DIR_OUT, function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.setup(15, gpio.DIR_OUT, function (err) { if (err) { gpio.destroy(); throw err; }});
}

function drive(driving) {
	gpio.write(7, driving['37'], function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.write(11, driving['38'], function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.write(13, driving['39'], function (err) { if (err) { gpio.destroy(); throw err; }});
	gpio.write(15, driving['40'], function (err) { if (err) { gpio.destroy(); throw err; }});
}

process.on('SIGINT', function () {
	console.log('\nStopping car...');
	gpio.destroy(function () {
		return process.exit();
	});

});

server.listen(3000, function () {
	console.log('Listening on port 3000...');
});
