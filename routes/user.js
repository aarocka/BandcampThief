var http = require('http');
var Shred = require("shred");

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

		var req = shred.get({
		  url: "http://api.bandcamp.com/api/url/1/info?key=vatnajokull&url=" + thequery,
		  headers: {
		    Accept: "application/json"
		  },
		  on: {
		    // You can use response codes as events
		    200: function(response) {
		      // Shred will automatically JSON-decode response bodies that have a
		      // JSON Content-Type
		      console.log(response.content.data);
		    },
		    // Any other response means something's wrong
		    response: function(response) {
		      console.log("Oh no!");
		    }
		  }
		});

	}else{
		console.log("an artist was searched");
	}
	res.send("You searched" + " " + thequery);
};