var archiver = require('archiver')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  ;

module.exports = release

function release(onfinish) {
  var package = require('../package.json')
    , archive = archiver.create('zip', {})
    , outName = path.join(
      package.config.releaseDirectory,
      util.format('%s_v%s.zip', package.name, package.version)
    )
    , outStream = fs.createWriteStream(outName)
    ;

  outStream.on('finish', function() {
    onfinish(archive.pointer(), outName)
  })

  archive.pipe(outStream);
  archive.directory("build", false);
  archive.finalize();

  return archive;

}