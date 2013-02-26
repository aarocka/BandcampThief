var request = require('request');
var util = require('util');

exports.albumpage = function(req, res) {
	console.log('This would be the album page');
	request('http://api.bandcamp.com/api/album/2/info?key=vatnajokull&album_id=' + req.query.album, function(error, response, body) {
		var albumInfo = JSON.parse(body);

		if (albumInfo.error) {
			res.end('There was an error: ' +albumInfo.error_message);
			return;
		}

		console.log(util.inspect(albumInfo));
		res.render('album', {
			title: 'album',
			tracks: albumInfo.tracks
		});
	});
};