var archiver = require('archiver')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  ;

module.exports = release

function release(onfinish) {
  var package = require('../package.json')
    , config = require('../config.json')
    , archive = archiver.create('zip', {})
    , outName = path.join(
      package.config.releaseDirectory,
      util.format('%s_v%s_%s.zip', package.name, package.version, config.env)
    )
    , outStream = fs.createWriteStream(outName)
    ;

  outStream.on('error', function(e) {
    onfinish(e, archive.pointer(), outName)
  })

  outStream.on('finish', function() {
    onfinish(null, archive.pointer(), outName)
  })

  archive.pipe(outStream);
  archive.directory(config.out, false);
  archive.finalize();

  return archive;

}