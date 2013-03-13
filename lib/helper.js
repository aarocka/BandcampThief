module.exports = {
	getBandInfo: getBandInfo,
	getAlbumInfo: getAlbumInfo,
	getSongInfo: getSongInfo,
	getURLInfo: getURLInfo,
	getDiscoInfo: getDiscoInfo
}

var request = require('request');

function getURLInfo(bandcampURL, callback) {
	if (bandcampURL.indexOf('.bandcamp.com') == -1) {
		bandcampURL = bandcampURL + '.bandcamp.com';
	}
	request('http://api.bandcamp.com/api/url/1/info?key=vatnajokull&url=' + bandcampURL, function(error, response, body){
		var bandcampURLinfo = {
			json: null,
			urlType:null
		};

		bandcampURLinfo.json = JSON.parse(body);

		if (bandcampURLinfo.json.album_id == undefined){
			// artist page
			bandcampURLinfo.urlType = "artist";
		} else {
			bandcampURLinfo.urlType = "album";
		}
		callback.call(this, bandcampURLinfo, bandcampURLinfo.json.error);
	});
}

function getDiscoInfo (bandId, callback) {
	request('http://api.bandcamp.com/api/band/3/discography?key=vatnajokull&band_id=' + bandId, function (error, response, body) {
		var discoInfo = JSON.parse(body);
		callback.call(this, discoInfo, discoInfo.error);
	});
}

function getBandInfo(bandId, callback) {
	request('http://api.bandcamp.com/api/band/3/info?key=vatnajokull&band_id=' + bandId, function(error, response, body) {
		var bandInfo = JSON.parse(body);
		callback.call(this, bandInfo, bandInfo.error);
	});
}

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
