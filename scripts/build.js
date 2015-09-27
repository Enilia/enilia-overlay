var fs = require('fs-extra-promise')
  , path = require('path')
  , util = require("util")
  , _extend = require('util')._extend
  , Promise = fs.Promise
  , glob = Promise.promisify(require('glob-all'))
  , package = require('../package.json')
  ;

var headerTpl = 'angular.module("%s", [\n\t%s,\n]);\n';

var contentTpl = [
	'\nangular.module("%s", []).run(["$templateCache", function($templateCache) {\n',
	'  $templateCache.put("%s",\n',
	'    "%s\\n" +\n',
	'    "");\n',
	'}]);\n',
];

module.exports = build;

function parse(tokens, contents) {
	tokens = _extend({
		version: package.version
	}, tokens);
	return contents.replace(/\{#(.+?)#\}/g, function(match, token) {
		return tokens[token] || "";
	})
}

function build(config) {
	var coreFiles = package.config.files.core.concat(config.files.core || [])
	  , staticFiles = package.config.files.static.concat(config.files.static || []);
	// empty build dir
	return fs.emptyDirAsync(config.out).cancellable()
	// get files
	.return(Promise.join(glob(coreFiles), glob(staticFiles), glob(package.config.templatesRoot)))
	.spread(function (coreFiles, staticFiles, templatesFiles) {
		return Promise.join(
			// parse and save core files
			coreFiles.map(function(fileName) {
				return fs.readFileAsync(fileName, 'utf8')
						.then(parse.bind(null, config.tokens))
						.then(function(contents) {
							return fs.outputFileAsync(path.join(config.out, path.relative("src", fileName)), contents)
						})
			}),
			// compile templates
			Promise.map(templatesFiles.sort(function(a, b) {
			    return a.localeCompare(b);
			}), function(fileName) {
				return fs.readFileAsync(fileName, 'utf8')
						.then(parse.bind(null, config.tokens))
						.then(function (contents) {
							fileName = path.relative("src", fileName).replace(/\\/g, "/");
							return {
								fileName: '"' + fileName + '"',
								contents: util.format(contentTpl[0], fileName)
										+ util.format(contentTpl[1], fileName)
										+ contents.split(/\r?\n/).map(function(line) {
										  	return util.format(contentTpl[2], line.replace(/"/g, '\\"'));
										  }).join('')
										+ contentTpl[3]
										+ contentTpl[4]
							}
						})
			}).then(function (files) {
				var names = files.map(function(fileData) { return fileData.fileName })
				  , tpls = files.map(function(fileData) { return fileData.contents })
				  ;

				return fs.outputFileAsync(path.join(config.out, package.config.templatesOut),
					  util.format(headerTpl, package.config.templatesModuleName, names.join(',\n\t'))
					+ tpls.join(''),
				'utf8');
			}),
			// save static files
			staticFiles.map(function(fileName) {
				return fs.copyAsync(fileName, path.join(config.out, path.relative("src", fileName)));
			})
		)
	}).return()
}
