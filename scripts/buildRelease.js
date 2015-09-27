var archiver = require('archiver')
  , fs = require('promised-io/fs')
  , promise = require('promised-io')
  , path = require('path')
  , util = require('util')
  , project = require('../package.json')
  ;

var archive = archiver.create('zip', {})
  , outName = path.join(
  		project.config.releaseDirectory,
  		util.format('%s_v%s.zip', project.name, project.version)
  	)
  , outStream = fs.createWriteStream(outName)
  ;

archive.pipe(outStream);

outStream.on('finish', function() {
	console.log('%s bytes written in %s', archive.pointer(), outName);
})

promise.all(
	project.files.map(function(file) {
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
