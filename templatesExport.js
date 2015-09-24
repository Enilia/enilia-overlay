var promise = require("promised-io")
  , fs = require("promised-io/fs")
  , path = require("path")
  , util = require("util")
  ;

const CONF = {
	base: 'app',
	output: 'app/tpls.js',
	moduleName: 'enilia.overlay.tpls',
	extfilter: '.html',
};

var headerTpl = 'angular.module("%s", [\n\t%s,\n]);\n';

// var headerTpl = [
// 	'angular.module("%s", [',
// 	']);\n'
// ];

var contentTpl = [
	'\nangular.module("%s", []).run(["$templateCache", function($templateCache) {\n',
	'  $templateCache.put("%s",\n',
	'    "%s\\n" +\n',
	'    "");\n',
	'}]);\n',
];

function crawl(from, files /* = [] */ ) {

	return fs.readdir(from).then(function(fileNames) {
		return promise.all(
			fileNames.map(function(fileName) {
				fileName = path.join(from, fileName);
				return fs.stat(fileName).then(function(stats) {
					if(stats.isDirectory()) {
						return crawl(fileName, files);
					} else {
						if(path.extname(fileName) === CONF.extfilter)
							return fs.readFile(fileName, 'utf8').then(function(fileContent) {
								files.push({
									name:fileName.replace(/\\/g, "/"),
									content:fileContent
								});
							});
					}
				});
			})
		);
	}).then(function() {
		return files.sort(function(a, b) {
			return a.name < b.name ? -1 : 1;
		});
	})

}

crawl(CONF.base, []).then(function(files) {
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
}).then(function(data) {
	var names = data[0]
	  , tpls = data[1]
	  ;

	fs.writeFile(CONF.output,
		  util.format(headerTpl, CONF.moduleName, names.join(',\n\t'))
		+ tpls.join(''),
	'utf8');
});