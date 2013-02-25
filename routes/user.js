//uses the new rest api system
//This page parses the query, then either shows the discgraphy
//or redirects to the albumpage
var request = require('request');

exports.query = function(req, res){
	//gets the user search field
	//lets start parsing
	var userquery = req.query.query;
	console.log();
	console.log('Hey the user typed ' + userquery);

	if (userquery.indexOf("bandcamp.com") !== -1){
		console.log("The users search was a url. Parsing the URL.")
			//Send the url to bandcamps api to dig some stuff up on the url
			//using request
		    //information returned by the bandcamp url search
			var request = require('request');

			request('http://api.bandcamp.com/api/url/1/info?key=vatnajokull&url=' + userquery, function (error, response, body) {
				if (!error && response.statusCode == 200) {
			  		console.log('Success!');
			  		var urlInfoString = body;
			  		console.log(urlInfoString);
			  		//urlInfo is string. converting to json
			  		var urlInfoJSON = JSON.parse(urlInfoString);
			  		console.log(urlInfoJSON.album_id);


			        if (urlInfoJSON.album_id == undefined) {
			        	console.log('Artist Page, fetching disco');
						request('http://api.bandcamp.com/api/band/3/discography?key=vatnajokull&band_id=' + urlInfoJSON.band_id, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								var disco = JSON.parse(urlInfoString);
								console.log(disco);
								for (var i = 0; i < disco['discography'].length ; i++) {
									
									res.send(disco.[discography].[i].title);


									/*res.render('search-results', { 
										title: 'you gave me a url',
										result: 'somthinSomthin' 
									});*/

								};
							}
						});

			        }else{
			        	console.log('Album. show track list');
			        	res.redirect('/album/?album=' + urlInfoJSON.album_id);
			        }

			      	
			  	};
			});

	};
};
