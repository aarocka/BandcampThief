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
		console.log("a url was searched");
		//find info on the url
		console.log();

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
		        var thejson = response.content.data;
		        console.log(thejson);
		        console.log();
		        
		        if (thejson.album_id == undefined) {
		        	console.log('Artist Page, fetching disco');

		        }else{
		        	console.log('Album. show track list');


		        }

		      	res.render('search-results', { 
					title: 'you gave me a url',
					result: thejson 
				});	

		    },
		    
		    // Any other response means something's wrong
		    response: function(response) {
		     console.log("ohknowz");
		    }
		  }
		});

		

	}else{
		console.log("an artist was searched");


	}



};