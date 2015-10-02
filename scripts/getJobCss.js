var fs = require('fs-extra-promise')
  , util = require('util')
  , path = require('path')
  ;

var line = ".%s .job { background-image:url('../images/glow/%s') }"

fs.readdirAsync('src/images/glow')
.then(function(files) {
	return files.sort(function(a, b) {
	    return a.localeCompare(b);
	})
})
.then(function(files) {
    return files.map(function(file) {
    	var name = path.basename(file.slice(0,1).toUpperCase() + file.slice(1), '.png').replace(/ /g, '-');
        return util.format(line, name, file);
    })
})
.then(function(r) {
    return fs.writeFileAsync('src/css/jobs.css', r.join('\n'), 'utf8')
})