var fs = require('fs')
  , util = require('util')
  , events = require('events')
  , filesize = require('filesize')
  , request = require('request')
  , helper = require('./helper')
  , tagger = require('./tagger');

var osSep = process.platform === 'win32' ? '\\' : '/'
  , downloadLocation = './bandcamp';

var prowl = [
//  '8365a3833fc87d193807c2fda83f931a4f7a2d497a2d49', // rainbowdash
//  '583b37514055d17bb6846feb4e104e3460b88b43' // mbilker
]

function clone(obj) {
  if (null === obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function mkdir_p(path, callback, position) {
  var parts = require('path').normalize(path).split(osSep);

  mode = 0777 & (~process.umask());
  position = position || 0;

  if (position >= parts.length) {
    return callback();
  }

  var directory = parts.slice(0, position + 1).join(osSep) || osSep;
  fs.stat(directory, function(err) {
    if (err === null) {
      mkdir_p(path, callback, position + 1);
    } else {
      fs.mkdir(directory, mode, function (err) {
        if (err && err.code != 'EEXIST') {
          return callback(err);
        } else {
          mkdir_p(path, callback, position + 1);
        }
      });
    }
  });
}

var Downloader = function Downloader() {
  var self = this;

  // Model for the progress
  var Progress = function() {
    this.tracksCompleted = 0;
    this.totalTracks = 0;
    this.progressSize = 0;
    this.sizeProgress = {};
    this.finished = [];
  }

  var DownloadListener = function() {
    this.setMaxListeners(0);
    this.progress = {};

    var self = this;

    var calcProgress = function(album) {
      var tprogress = self.progress[album];

      var completed = 0;
      for (var x in tprogress.sizeProgress) {
        var track = tprogress.sizeProgress[x];
        completed += (track.completed / track.size);
      }
      tprogress.progressSize = (completed / tprogress.totalTracks) * 100;

      io.sockets.emit(album + ' progress', {
        album: album,
        progressSize: tprogress.progressSize,
        totalTracks: tprogress.totalTracks,
        tracksCompleted: tprogress.tracksCompleted
      });
    }

    self.on('catchup', function(album_id, fn) {
      var finished = self.progress[album_id].finished || [];
      fn(finished);
    });

    self.on('song', function(t, tlen, len) {
      console.log(t.title + ': ' + filesize(len));

      self.progress[t.album_id] = self.progress[t.album_id] || new Progress();
      self.progress[t.album_id].sizeProgress[t.track_id] = { size: len, completed: 0 };
      self.progress[t.album_id].totalTracks = tlen;
      calcProgress(t.album_id);
    });

    self.on('finished', function(t, path, album, band) {
      console.log('Finished: ' + t.title);

      self.progress[t.album_id].tracksCompleted += 1;
      calcProgress(t.album_id);

      for (var i = 0, l = prowl.length; i < l; i++) {
        request.post("https://api.prowlapp.com/publicapi/add?apikey=" + prowl[i] + "&application=BandcampThief&description=" + t.title + " finished");
      }

      io.sockets.emit(t.album_id + ' finished', {
        track: t
      });

      self.progress[t.album_id].finished.push(t);
      console.log(self.progress);

      tagger.tagSong(path, { artist: t.artist || band.name, album: album.title, title: t.title, totalTracks: self.progress[t.album_id].totalTracks, trackNumber: t.number });
    });

    self.on('chunk', function(t, size) {
      self.progress[t.album_id].sizeProgress[t.track_id].completed += size;
      calcProgress(t.album_id);
    });
  }
  util.inherits(DownloadListener, events.EventEmitter);
  self.queue = downloads = new DownloadListener();

  function downloadSong(track, albumInfo, bandInfo, retry) {
    var path = util.format('%s/%s/%s/%s - %s - %s %s.mp3',
      downloadLocation,
      bandInfo.name,
      albumInfo.title,
      track.artist || bandInfo.name,
      albumInfo.title,
      String('0'+track.number).slice(-2),
      track.title
    );
    var output = fs.createWriteStream(path);
    var req = request.get(track.streaming_url);
    req.on('response', function(res) {
      if (!(res.statusCode > 199 && res.statusCode < 300)) {
        console.log('Failed to get: ' + track.title);
        process.nextTick(function() {
          downloadSong(track, albumInfo, bandInfo, true);
        });
        return;
      }

      var len = parseInt(res.headers['content-length'], 10);
      var t = clone(track);
      downloads.emit('song', t, albumInfo.tracks.length, len);
      res.on('end', function() {
        downloads.emit('finished', t, path, albumInfo, bandInfo);
      });
      res.on('data', function(chunk) {
        downloads.emit('chunk', t, chunk.length);
      });
    });
    req.pipe(output);
  }

  function downloadAlbum(albumId) {
    helper.getAlbumInfo(albumId, function(albumInfo, error) {
      if (error) throw error;
      helper.getBandInfo(albumInfo.band_id, function(bandInfo, error) {
        if (error) {
          console.log(error);
          return;
        }
        mkdir_p(util.format('%s/%s/%s', downloadLocation, bandInfo.name, albumInfo.title), function(err) {
          if (err) throw err;
          for (var i = 0, l = albumInfo.tracks.length; i < l; i++) {
            var track = albumInfo.tracks[i];
            downloadSong(track, albumInfo, bandInfo);
          }
        });
      });
    });
  }

  self.downloadSong = downloadSong;
  self.downloadAlbum = downloadAlbum;
}

if (!global.downloader) {
  global.downloader = new Downloader();
}

module.exports = global.downloader;
