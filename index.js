
var program = require('commander')
  , path = require('path')
  , util = require('util')
  , watch = require('node-watch')
  , package = require('./package.json')
  , Promise = require("bluebird")
  , build = Promise.resolve()
  ;

program
	.version(package.version)
	.option('-b, --buildlocal', 'build local app')
	.option('-p, --buildparse', 'build parse app')
	.option('-r, --release', 'build release app')
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

function main() {
	delete require.cache[path.resolve('./package.json')]
	package = require('./package.json')

	var now = Date.now();

	if(program.buildlocal) {
		build = build.then(thenlog("building local app"))
					 .return(package.config.build).then(require('./scripts/build.js'));
		if(program.release) build = build.then(release)
	} else if(program.release) {
		build = build.then(release);
	}
	if(program.buildparse) {
		build = build.then(thenlog("building parse app"))
					 .return(package.config.parse).then(require('./scripts/build.js'));
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
	watch(['src', 'package.json'], main)
}

main()