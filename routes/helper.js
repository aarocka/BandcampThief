module.exports = {
	getAlbumInfo: getAlbumInfo,
	getSongInfo: getSongInfo
}

var request = require('request');

function getAlbumInfo(albumId, callback) {
	request('http://api.bandcamp.com/api/album/2/info?key=vatnajokull&album_id=' + albumId, function(error, response, body) {
		var albumInfo = JSON.parse(body);
		callback.call(this, albumInfo, albumInfo.error);
	});
}

function getSongInfo(songId, callback) {
	request('http://api.bandcamp.com/api/track/3/info?key=vatnajokull&track_id=' + songId, function(error, response, body) {
		var trackInfo = JSON.parse(body);
		callback.call(this, trackInfo, trackInfo.error);
	});
}