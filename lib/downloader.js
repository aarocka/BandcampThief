module.exports = function(lio) {
	io = lio;
	return eexports;
}

eexports = {
	downloadAlbum: downloadAlbum
}

var fs = require('fs')
  , util = require('util')
  , events = require('events')
  , filesize = require('filesize')
  , helper = require('./helper');

var io;

var osSep = process.platform === 'win32' ? '\\' : '/'
  , downloadLocation = './bandcamp';

var prowl = [
//  '8365a3833fc87d193807c2fda83f931a4f7a2d497a2d49', // rainbowdash
  '583b37514055d17bb6846feb4e104e3460b88b43' // mbilker
]

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
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

// Model for the progress
var Progress = function() {
	this.progress = 0;
	this.tracksCompleted = 0;
	this.totalTracks = 0;
	this.sizeCompleted = 0;
	this.totalSize = 0;
}

var downloadListener = function() {
	this.setMaxListeners(0);
	this.downloads = {};
	this.progress = {};
	this.on('song', function(t, len) {
		this.downloads[t.album_id] = this.downloads[t.album_id] || {};
		this.downloads[t.album_id][t.track_id] = t;

		console.log(t.title + ': ' + filesize(len));

		this.progress[t.album_id] = this.progress[t.album_id] || new Progress();
		this.progress[t.album_id].totalTracks += 1;
		this.progress[t.album_id].totalSize += len;
	});
	this.on('finished', function(t) {
		this.downloads[t.album_id][t.track_id] = null;

		console.log('Finished: ' + t.title);
		console.log(this.progress);

		this.progress[t.album_id].tracksCompleted += 1;

		for (var i = 0, l = prowl.length; i < l; i++) {
			require('request').post("https://api.prowlapp.com/publicapi/add?apikey=" + prowl[i] + "&application=BandcampThief&description=" + t.title + " finished");
		}
	});
	this.on('chunk', function(t, chunk) {
		this.progress[t.album_id].sizeCompleted += chunk;
	});
}
util.inherits(downloadListener, events.EventEmitter);
var downloads = new downloadListener(); // init event emitter

function downloadSong(track, albumInfo, bandInfo) {
	var output = fs.createWriteStream(util.format('%s/%s/%s/%s %s.mp3', downloadLocation, bandInfo.name, albumInfo.title, String('0'+track.number).slice(-2), track.title));
	var req = require('request').get(track.streaming_url);
	req.on('response', function(res) {
		var len = parseInt(res.headers['content-length'], 10);
		var t = clone(track);
		downloads.emit('song', t, len);
		res.on('end', function() {
			downloads.emit('finished', t);
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
