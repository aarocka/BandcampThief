var resolve = require('path').resolve
  , taglib = require('taglib');

var id3_command = resolve(__dirname + '/../id3/bin/bin/id3v2')
  , ld_library_path = resolve(__dirname + '/../id3/bin/lib/');

var Tagger = function() {
  var self = this;

  function tagSongOld(path, params) {
    var args = ['-A', params.album, '-a', params.artist, '-t', params.title, '-T', params.trackNumber + '/' + params.totalTracks, path ];
    var child = spawn(
      id3_command,
      args,
      {
        cwd: resolve(__dirname + '/../'),
        env: { 'LD_LIBRARY_PATH': ld_library_path }
      }
    );

    child.on('close', function(code) {
      if (code !== 0) {
        console.log('Tagging of ' + params.title + ' exited with code ' + code);
      } else {
        console.log('Successfully tagged ' + params.title);
      }
    });

    child.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });

    child.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
  }

  function tagSong(path, args) {
    var tag = taglib.tagSync(path);
    tag.artist = args.artist;
    tag.album = args.album;
    tag.title = args.title;
    tag.track = args.trackNumber;
    tag.saveSync();
  }
  
  self.tagSong = tagSong;
}

module.exports = new Tagger();

