
var program = require('commander')
  , path = require('path')
  , util = require('util')
  , watch = require('node-watch')
  , package = require('./package.json')
  , config = require('./config.json')
  , Promise = require("bluebird")
  , build = Promise.resolve()
  ;

program
	.version(package.version)
	.option('-b, --build', 'build app')
	.option('-r, --release', 'create release zip')
	.option('-w, --watch', 'watch source and build')
	.parse(process.argv);


function log() {
	var now = new Date().toTimeString().split(' ')[0]
	  , args = util.format.apply(util, arguments)
	  ;
	console.log.apply(console, ["[%s]", now, args])
}

function thenlog() {
	var args = arguments;
	return function() {
		log.apply(null, args);
	}
}

function forceRequire(fileName) {
	delete require.cache[path.resolve(fileName)];
	return require(fileName);
}

function main() {
	package = forceRequire('./package.json')
	config = forceRequire('./config.json')

	var now = Date.now();

	if(program.build) {
		build = build.then(thenlog("building app"))
					 .return(config).then(require('./scripts/build.js'));
		if(program.release) build = build.then(release)
	} else if(program.release) {
		build = build.then(release);
	}

	build = build.then(function() {
		log("build time: %ss", (Date.now() - now) / 1000);
	});
}

function release() {
	var now = Date.now();
	return Promise.promisify(require('./scripts/buildRelease.js'))()
		.spread(function(pointer, outName) {
			log('%s bytes written in %s (%ss)', pointer, outName, (Date.now() - now) / 1000);
		})
}

if(program.watch) {
	watch(['src', 'package.json', 'config.json'], main)
}

main()