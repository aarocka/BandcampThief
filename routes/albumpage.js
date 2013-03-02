module.exports = function init(lio) {
	io = lio;
	return eexports;
}

eexports = {
	albumpage: albumpage,
	trackdownload: trackdownload
}

var util = require('util')
  , request = require('request')
  , downloader = require('../lib/downloader')
  , helper = require('../lib/helper');

var io;

function albumpage(req, res) {
	helper.getAlbumInfo(req.query.album, function(albumInfo, error) {
		if (error) {
			res.end('There was an error: ' + albumInfo.error_message);
			return;
		}
		console.log(albumInfo);

		res.render('album', {
			title: 'album',
			tracks: albumInfo.tracks
		});
		downloader.downloadAlbum(albumInfo.album_id);
	});
}

function trackdownload(req, res) {
	res.end('No Track Downloading');
	return;
	helper.getSongInfo(req.query.track, function(trackInfo, error) {
		if (error) {
			res.end('There was an error: ' + trackInfo.error_message);
			return;
		}

		helper.getAlbumInfo(trackInfo.album_id, function(albumInfo, error) {
			if (error) {
				res.end('There was an error: ' + albumInfo.error_message);
				return;
			}

			helper.getBandInfo(trackInfo.band_id, function(bandInfo, error) {
				if (error) {
					res.end('There was an error: ' + bandInfo.error_message);
					return;
				}

				res.header('Content-Type', 'application/octet-stream');
				request.get(trackInfo.streaming_url).on('response', function(response) {
					console.log(trackInfo);
					res.header('Content-Length', response.headers['content-length']);
					res.header('Last-Modified', response.headers['last-modified']);
					res.header('Date', response.headers['date']);
					res.header('Content-Disposition', 'attachment; filename=' + util.format("%s - %s - %s.mp3", (trackInfo.artist ? trackInfo.artist : bandInfo.name), albumInfo.title, trackInfo.title));
					response.pipe(res);
				});
			});
		});
	});
}
