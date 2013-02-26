var util = require('util')
  , request = require('request')
  , helper = require('./helper');

exports.albumpage = function(req, res) {
	helper.getAlbumInfo(req.query.album, function(albumInfo, error) {
		if (error) {
			res.end('There was an error: ' + error);
			return;
		}
		console.log(albumInfo);

		res.render('album', {
			title: 'album',
			tracks: albumInfo.tracks
		});
	})
};

exports.trackdownload = function(req, res) {
	helper.getSongInfo(req.query.track, function(trackInfo, error) {
		if (error) {
			res.end('There was an error: ' + trackInfo.error_message);
		}

		helper.getAlbumInfo(trackInfo.album_id, function(albumInfo, error) {
			if (error) {
				res.end('There was an error: ' + albumInfo.error_message);
			}

			for (var i = 0, l = albumInfo.tracks.length; i < l; i++) {
				var temp = albumInfo.tracks[i];
				if (temp.track_id == trackInfo.track_id) {
					trackInfo = temp;
					break;
				}
			}

			res.header('Content-Type', 'application/octet-stream');
			request.get(trackInfo.streaming_url).on('response', function(response) {
				console.log(trackInfo);
				res.header('Content-Length', response.headers['content-length']);
				res.header('Last-Modified', response.headers['last-modified']);
				res.header('Date', response.headers['date']);
				res.header('Content-Disposition', 'attachment; filename=' + util.format("%s - %s - %s.mp3", trackInfo.artist, albumInfo.title, trackInfo.title));
				response.pipe(res);
			});
		});
	});
}