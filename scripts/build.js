var fs = require('fs-extra-promise')
  , path = require('path')
  , util = require("util")
  , _extend = require('util')._extend
  , Promise = fs.Promise
  , glob = Promise.promisify(require('glob-all'))
  , uglify = require('uglify-js')
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

function build() {
	var package = require('../package.json')
	  , config = require('../config.json')
	  , coreFiles = package.config.files.core.concat(config.files.core || [])
	  , staticFiles = package.config.files.static.concat(config.files.static || [])
	  ;

	function parse(tokens, contents) {
		tokens = _extend({
			VERSION: package.version
		}, tokens);
		return contents.replace(/<%=(.+?)%>/g, function(match, token) {
			return tokens[token.trim()] || "";
		})
	}

	function getPath(fileName, map) {
		if(map && fileName in map) return map[fileName];
		map = package.config.files.map;
		if(map && fileName in map) return map[fileName];

		return path.posix.relative("src", fileName);
		// var pathObject = path.posix.parse(fileName);
		// pathObject.dir = pathObject.dir.split('/').slice(1).join('/');
		// return path.posix.format(pathObject);
	}

	// empty build dir
	return fs.emptyDirAsync(config.out).cancellable()
	// get files
	.return(Promise.join(glob(coreFiles), glob(staticFiles), glob(package.config.templatesRoot)))
	.spread(function (coreFiles, staticFiles, templatesFiles) {
		return Promise.join(
			// parse, save and minify core files
			Promise.map(coreFiles.sort(function(a, b) {
			    return a.localeCompare(b);
			}), function(fileName) {
				return fs.readFileAsync(fileName, 'utf8')
						.then(parse.bind(null, config.tokens))
						.then(function(contents) {
							return fs.outputFileAsync(path.posix.join(config.out, getPath(fileName)), contents).return(contents)
						})
						.then(function (contents) {
							fileName = path.posix.relative('app', getPath(fileName));
							return {
								fileName: fileName,
								contents: contents
							}
						})
			})
			.then(function(files) {
				var toplevel
				  , compressed_ast
				  , sourceMap = uglify.SourceMap({
				  	file: 'all.js.map',
				  })
				  ;
				files.forEach(function(fileData){
					toplevel = uglify.parse(fileData.contents, {
						filename: fileData.fileName,
						toplevel: toplevel
					});
				});
				toplevel.figure_out_scope();
				compressed_ast = toplevel.transform(uglify.Compressor());
				compressed_ast.figure_out_scope();
				compressed_ast.compute_char_frequency();
				compressed_ast.mangle_names();
				return [compressed_ast.print_to_string({
					source_map: sourceMap
				  }),
				sourceMap.toString()];
			})
			.spread(function(code, sourceMap) {
				return Promise.join(
					fs.outputFileAsync(path.posix.join(config.out, 'app/all.js'), code + "\n//# sourceMappingURL=all.js.map"),
					fs.outputFileAsync(path.posix.join(config.out, 'app/all.js.map'), sourceMap)
					)
			}),
			// compile templates
			Promise.map(templatesFiles.sort(function(a, b) {
			    return a.localeCompare(b);
			}), function(fileName) {
				return fs.readFileAsync(fileName, 'utf8')
						.then(parse.bind(null, config.tokens))
						.then(function (contents) {
							fileName = getPath(fileName);
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

				return fs.outputFileAsync(path.posix.join(config.out, package.config.templatesOut),
					  util.format(headerTpl, package.config.templatesModuleName, names.join(',\n\t'))
					+ tpls.join(''),
				'utf8');
			}),
			// save static files
			staticFiles.map(function(fileName) {
				return fs.copyAsync(fileName, path.posix.join(config.out, getPath(fileName, config.files.map)));
			})
		)
	}).return()
}
