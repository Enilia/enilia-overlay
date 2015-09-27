
var program = require('commander')
  , path = require('path')
  , watch = require('node-watch')
  , package = require('./package.json')
  ;

program
	.version(package.version)
	.option('-b, --buildlocal', 'build local app')
	.option('-p, --buildparse', 'build parse app')
	.option('-r, --release', 'build release app')
	.option('-w, --watch', 'watch source and build')
	.parse(process.argv);


function main() {
	delete require.cache[path.resolve('./package.json')]
	package = require('./package.json')

	if(program.buildlocal) {
		console.log("build local app");
		var local = require('./scripts/build.js')(package.config.build);
		if(program.release) local.then(release)
	} else if(program.release) {
		release();
	}
	if(program.buildparse) {
		console.log("build parse app");
		require('./scripts/build.js')(package.config.parse);
	}
}

function release() {
	require('./scripts/buildRelease.js')(function(pointer, outName) {
		console.log('%s bytes written in %s', pointer, outName);
	})
}

if(program.watch) {
	watch(['src', 'package.json'], main)
}

main()