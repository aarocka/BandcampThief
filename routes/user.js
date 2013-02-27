//uses the new rest api system
//This page parses the query, then either shows the discgraphy
//or redirects to the albumpage
var request = require('request');
var util = require('util');
var helper = require('./helper');

exports.query = function(req, res){
	//gets the user search field
	//lets start parsing
	var userquery = req.query.query;
	console.log();
	console.log('Hey the user typed ' + userquery);

	helper.getURLInfo(req.query.query, function(bandcampURLinfo, error){
		if (error) {
			res.end('There was an error: ' + bandcampURLinfo.error_message);
			return;
		} else{
		console.log('That url was an ' + bandcampURLinfo.urlType);
		console.log(bandcampURLinfo.json);

		if (bandcampURLinfo.urlType == 'artist') {
			
			helper.getDiscoInfo(bandcampURLinfo.json.band_id, function(discoInfo, error){
				if (error) {
					res.end('There was an error: ' + bandcampURLinfo.error_message);
					return;
				} else{
					res.render('search-results', {
						title: 'Discography',
						disco: discoInfo.discography
					});

				}
			})


			

		} else if (bandcampURLinfo.urlType == 'album') {
			console.log('show track list');
			res.redirect('/album/?album=' + bandcampURLinfo.json.album_id);
		}
	}
	})
};
