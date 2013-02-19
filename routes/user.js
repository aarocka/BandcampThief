var http = require('http');
var Shred = require("shred");
var assert = require("assert"); 

/*
 * GET users listing.
 */

exports.query = function(req, res){
	var thequery = req.query.query;
	var shred = new Shred();
	

	console.log("user searched" + " " + thequery);
	console.log();


	if (thequery.indexOf("bandcamp.com") !== -1){
		console.log("url was searched");
		//find info on the url

		var thedata = shred.get({
		  url: "http://api.bandcamp.com/api/url/1/info?key=vatnajokull&url=" + thequery,
		  headers: {
		    Accept: "application/json"
		  },
		  on: {
		    // You can use response codes as events
		    200: function(response) {
		      // Shred will automatically JSON-decode response bodies that have a
		      // JSON Content-Type
		      //response.content.data
		      var thejson = response.content.body;
		      res.send(thejson);
		     
		    },
		    
		    // Any other response means something's wrong
		    response: function(response) {
		     console.log("ohknowz");
		    }
		  }
		});
		console.log(thejson);

		//if artist page, return discography

		//if album redirect to download album page

	}else{
		console.log("an artist was searched");
	}


	res.render('search-results', { 
		result: 'you gave me a url',
		title: 'you gave me a url' 
	});
};