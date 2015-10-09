var net = require('net')
  , readline = require('readline')
  ;

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt('> ');

rl.on('close', function () {
	client.end();
});

var client = net.connect(8124, function() {
	console.log('connected to server!');

	rl.on('line', function (cmd) {
		client.write(cmd);
		rl.prompt();
	});

	rl.prompt();

});

client.on('data', function(data) {

});

client.on('error', function() {
	console.log('disconnected from server');
	rl.close()
})

client.on('end', function() {
	console.log('disconnected from server');
});