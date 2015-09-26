var promise = require("promised-io")
  , fs = require("promised-io/fs")
  , path = require("path")
  , util = require("util")
  , project = require('../package.json')
  ;

function crawl(fileNames) {

	var files = [];

	return promise.all(
		fileNames.map(function(fileName) {
			return fs.stat(fileName).then(function(stats) {
				if(stats.isDirectory()) {
					return fs.readdir(fileName)
						.then(function(fileName_fileNames) {
							return fileName_fileNames.map(function(fileName_fileName) {
								return path.join(fileName, fileName_fileName);
							})
						})
						.then(crawl).then(function (fileName_fileNames) {
							files = files.concat(fileName_fileNames);
						})
				} else {
					files.push(path.normalize(fileName));
				}
			});
		})
	).then(function() {
		return files;
	})

}

crawl(project.files)
.then(function (files) {
	return promise.all(
		files.map(function(file) {
			file = path.join(project.config.parseDirectory, file);
			return promise.seq(
				file.split('\\').slice(0, -1).map(function(dir) {
					return function(tree) {
						dir = path.join(tree, dir);
						return fs.mkdir(dir).then(function () {}, function () {})
							.then(function() {
								return dir;
							})
					}
				})
				, ''
			)
		})
	).then(function() {
		return files;
	})
})
// .then(function (files) {
// 	console.log(files)
// })
.then(function(files) {
	files.forEach(function(file) {
		var _in = fs.createReadStream(file)
		  , _out = fs.createWriteStream(path.join(project.config.parseDirectory, file))
		  ;
		_in.pipe(_out);
	})
});
