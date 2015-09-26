var promise = require("promised-io")
  , fs = require("promised-io/fs")
  , path = require("path")
  , util = require("util")
  , project = require('../package.json')
  ;

var headerTpl = 'angular.module("%s", [\n\t%s,\n]);\n';

var contentTpl = [
	'\nangular.module("%s", []).run(["$templateCache", function($templateCache) {\n',
	'  $templateCache.put("%s",\n',
	'    "%s\\n" +\n',
	'    "");\n',
	'}]);\n',
];

function crawl(from) {

	var files = [];

	return fs.readdir(from).then(function(fileNames) {
		return promise.all(
			fileNames.map(function(fileName) {
				fileName = path.join(from, fileName);
				return fs.stat(fileName).then(function(stats) {
					if(stats.isDirectory()) {
						return crawl(fileName).then(function (fileNames) {
							files = files.concat(fileNames);
						});
					} else {
						files.push(fileName);
					}
				});
			})
		);
	}).then(function() {
		return files;
	})

}

crawl(project.config.templatesRoot)
.then(function(fileNames) {
	return fileNames.filter(function(fileName) {
		return path.extname(fileName) === project.config.templatesExtension;
	}).sort(function(a, b) {
		return a < b ? -1 : 1;
	});
})
.then(function(fileNames) {
	return promise.all(
		fileNames.map(function(fileName) {
			return fs.readFile(fileName, 'utf8').then(function(fileContent) {
				return {
					name:fileName.replace(/\\/g, "/"),
					content:fileContent
				};
			})
		})
	);
})
.then(function(files) {
	var tpls = []
	files.forEach(function(fileData) {
		console.log("exporting %s", fileData.name);

		tpls.push(util.format(contentTpl[0], fileData.name)
				+ util.format(contentTpl[1], fileData.name)
				+ fileData.content.split(/\r?\n/).map(function(line) {
				  	return util.format(contentTpl[2], line.replace(/"/g, '\\"'));
				  }).join('')
				+ contentTpl[3]
				+ contentTpl[4]);
	});

	return [
		files.map(function(fileData) { return '"' + fileData.name + '"'; }),
		tpls
	];
})
.then(function(data) {
	var names = data[0]
	  , tpls = data[1]
	  ;

	fs.writeFile(project.config.templatesOut,
		  util.format(headerTpl, project.config.templatesModuleName, names.join(',\n\t'))
		+ tpls.join(''),
	'utf8');
});