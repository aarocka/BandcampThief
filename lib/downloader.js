module.exports = {
	downloadAlbum: downloadAlbum
}

var fs = require('fs')
  , util = require('util')
  , request = require('request')
  , helper = require('./helper');

var osSep = process.platform === 'win32' ? '\\' : '/';

function mkdir_p(path, mode, callback, position) {
	var parts = require('path').normalize(path).split(osSep);

	mode = mode || process.umask();
	position = position || 0;
  
	if (position >= parts.length) {
		return callback();
	}
  
	var directory = parts.slice(0, position + 1).join(osSep) || osSep;
	fs.stat(directory, function(err) {
		if (err === null) {
			mkdir_p(path, mode, callback, position + 1);
		} else {
			fs.mkdir(directory, mode, function (err) {
				if (err && err.code != 'EEXIST') {
					return callback(err);
				} else {
					mkdir_p(path, mode, callback, position + 1);
				}
			});
		}
	});
}

function downloadAlbum(albumId) {
	helper.getAlbumInfo(albumId, function(albumInfo, error) {
		if (error) throw error;
		helper.getBandInfo(albumInfo.band_id, function(bandInfo, error) {
			if (error) {
				console.log(error);
				return;
			}
			mkdir_p(util.format('/tmp/%s/%s', bandInfo.name, albumInfo.title), 755, function(err) {
				if (err) throw err;
				for (var i = 0, l = albumInfo.tracks.length; i < l; i++) {
					var track = albumInfo.tracks[i];
					var output = fs.createWriteStream(util.format('/tmp/%s/%s/%s %s.mp3', bandInfo.name, albumInfo.title, String('0'+track.number).slice(-2), track.title));
					var req = request.get(track.streaming_url)
					req.on('response', function(res) {
						var len = parseInt(res.headers['content-length'], 10);
						var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
							complete: '=',
							incomplete: ' ',
							width: 20,
							total: len
						});
						res.on('data', function(chunk) {
							bar.tick(chunk.length);
						});
						res.on('end', function() {
							console.log('\n');
						});
					});
					req.pipe(output);
				}
			});
		});
	});
}
