module.exports = function init(lio) {
	io = lio;
	return eexports;
}

eexports = {
	query: query
}

var request = require('request')
  , util = require('util')
  , helper = require('../lib/helper');

var io;

function query(req, res){
	// gets the user search field
	// lets start parsing
	var userquery = req.query.query;
	console.log();
	console.log('Hey the user typed ' + userquery);

	helper.getURLInfo(req.query.query, function(bandcampURLinfo, error){
		if (error) {
			res.end('There was an error: ' + bandcampURLinfo.error_message);
			return;
		}
		console.log('That url was an ' + bandcampURLinfo.urlType);
		console.log(bandcampURLinfo.json);

		if (bandcampURLinfo.urlType == 'artist') {
			helper.getDiscoInfo(bandcampURLinfo.json.band_id, function(discoInfo, error){
				if (error) {
					res.end('There was an error: ' + bandcampURLinfo.error_message);
					return;
				}
				res.render('search-results', {
					title: discoInfo['discography'][1]['artist'] + " 's discography",
					disco: discoInfo.discography
				});
			});
		} else if (bandcampURLinfo.urlType == 'album') {
			console.log('show track list');
			res.redirect('/album/?album=' + bandcampURLinfo.json.album_id);
		}
	});
};
