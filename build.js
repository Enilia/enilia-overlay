var archiver = require('archiver')
  , fs = require('promised-io/fs')
  , promise = require('promised-io')
  , path = require('path')
  , util = require('util')
  , project = require('./package.json')
  ;

const CONF = {
	input: [
		'app',
		'css',
		'images',
		'js/vendor/bootstrap/dist/css/bootstrap.min.css',
		'js/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
		'js/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
		'js/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
		'js/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
		'js/vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
		'js/vendor/angular/angular.min.js',
		'js/vendor/angular/angular.min.js.map',
		'js/vendor/angular-route/angular-route.min.js',
		'js/vendor/angular-route/angular-route.min.js.map',
		'js/vendor/ngstorage/ngStorage.min.js',
		'enilia_overlay.html',
	],
	out: 'Releases'
};

var archive = archiver.create('zip', {})
  , outName = util.format('%s_v%s.zip', project.name, project.version)
  , outStream = fs.createWriteStream(
  		path.join(CONF.out, outName)
  	)
  ;

archive.pipe(outStream);

outStream.on('finish', function() {
	console.log('%s bytes written in %s', archive.pointer(), outName);
})

promise.all(
	CONF.input.map(function(file) {
		return fs.stat(file).then(function(stats) {
			if(stats.isDirectory()) {
				archive.directory(file);
			} else {
				archive.file(file);
			}
		});
	})
).then(function() {
	archive.finalize();
});
