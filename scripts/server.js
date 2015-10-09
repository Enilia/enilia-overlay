var net = require('net')
  , spawn = require('child_process').spawn
  , path = require('path')
  , config = require('../config.json')
  , out = path.resolve('..', config.out)
  , php
  ;

function runPhp() {
	if(php) php.kill();
	php = spawn('php', ['-S', 'localhost:80', '-a', '-t', out])

	php.stdout.on('data', function (data) {
		console.log('php: ' + data);
	});

	php.stderr.on('data', function (data) {
		console.log('php: ' + data);
	});
}

var server = net.createServer(function(c) {
	console.log('client connected');
	c.on('end', function() {
		console.log('client disconnected');
	});
	c.on('data', function(data) {
		data = data.toString();
		if(data == "restart") {
			runPhp();
			console.log('php restarted');
		} else {
			console.log(data);
		}
	})
});

server.listen(8124, '127.0.0.1', function() {
	console.log('server bound');
});