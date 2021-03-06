var util = require('util')
  , request = require('request')
  , helper = require('./lib/helper');

module.exports = {
	index: index,
	query: query,
	albumpage: albumpage,
	trackdownload: trackdownload
}

function index(req, res){
	res.render('index', { title: 'Bandcamp Thief' });
}

function albumpage(req, res) {
	helper.getAlbumInfo(req.query.album, function(albumInfo, error) {
		if (error) {
			res.end('There was an error: ' + albumInfo.error_message);
			return;
		}

		res.render('album', {
			title: 'album',
			id: albumInfo.album_id,
			tracks: albumInfo.tracks
		});
		downloader.downloadAlbum(albumInfo.album_id);
	});
};

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
					//console.log(trackInfo);
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

function query(req, res){
	// gets the user search field
	// lets start parsing
	var userquery = req.query.query;

	helper.getURLInfo(req.query.query, function(bandcampURLinfo, error){
		if (error) {
			res.end('There was an error: ' + bandcampURLinfo.error_message);
			return;
		}

		if (bandcampURLinfo.urlType == 'artist') {
			helper.getDiscoInfo(bandcampURLinfo.json.band_id, function(discoInfo, error){
				if (error) {
					res.end('There was an error: ' + bandcampURLinfo.error_message);
					return;
				}
				res.render('search-results', {
					title: discoInfo.discography[1].artist + "'s discography",
					disco: discoInfo.discography
				});
			});
		} else if (bandcampURLinfo.urlType == 'album') {
			console.log('show track list');
			res.redirect('/album/?album=' + bandcampURLinfo.json.album_id);
		}
	});
};
