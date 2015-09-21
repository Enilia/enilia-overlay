var fs = require('promised-io/fs')
  , util = require('util')
  , path = require('path')
  ;

var line = ".%s .job { background-image:url('../images/glow/%s') }"

fs.readdir('images/glow').then(function(files) {
    return files.map(function(file) {
    	var name = path.basename(file.slice(0,1).toUpperCase() + file.slice(1), '.png').replace(/ /g, '-');
        return util.format(line, name, file);
    })
}).then(function(r) {
    return fs.writeFile('css/jobs.css', r.join('\n'), 'utf8')
})