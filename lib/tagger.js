var spawn = require('child_process').spawn;

var id3_command = __dirname + '/id3/bin/bin/id3v2'
  , ld_library_path = __dirname + '/id3/bin/lib/';

var Tagger = function() {
  var self = this;

  function tagFile(path, params) {
    var child = spawn(
      id3_command,
      ['-A', params.album, '-a', params.artist, '-t', params.title, '-T', params.trackNumber + '/' + params.totalTracks, path ],
      {
        cwd: __dirname,
        env: { 'LD_LIBRARY_PATH': ld_library_path }
      }
    );

    child.on('close', function(code) {
      if (code !== 0) {
        console.log('Tagging of ' + params.title + ' exited with code ' + code);
      }
    });
  }
  
  self.tagFile = tagFile;
}

module.exports = new Tagger();

