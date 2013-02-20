//uses the new rest api system
var request = require('request');

exports.query = function(req, res){
	//gets the user search field
	//lets start parsing
	var userquery = req.query.query;
	console.log();
	console.log('Hey the user typed' + userquery);

	if (userquery.indexOf("bandcamp.com") !== -1){
		console.log("The users search was a url. Parsing the URL.")
			//Send the url to bandcamps api to dig some stuff up on the url
			//using request
			var urlInfo; //information returned by the bandcamp url search
			var request = require('request');

			request('http://api.bandcamp.com/api/url/1/info?key=vatnajokull&url=' + userquery, function (error, response, body) {
				if (!error && response.statusCode == 200) {
			  	console.log('Success!');			        
			        if (body.album_id == undefined) {
			        	console.log('Artist Page, fetching disco');
			        }else{
			        	console.log('Album. show track list');

			        }

			      	res.render('search-results', { 
						title: 'you gave me a url',
						result: 'somthin' 
					});	


			  	}
			});



	}






};
