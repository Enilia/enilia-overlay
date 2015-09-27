
var program = require('commander')
  , package = require('./package.json')
  ;

program
	.version(package.version)
	.option('-b, --buildlocal', 'build local app')
	.option('-p, --buildparse', 'build parse app')
	.option('-r, --release', 'build release app')
	.option('-w, --watch', 'watch source and build')
	.parse(process.argv);

if(program.buildlocal) {
	console.log("build local app");
	require('./scripts/build.js')(package.config.build);
}
if(program.buildparse) {
	console.log("build parse app");
	require('./scripts/build.js')(package.config.parse);
}