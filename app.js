
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , search = require('./routes/user')
  , album = require('./routes/albumpage')
  , http = require('http')
  , path = require('path');

<<<<<<< HEAD:app
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log("Express server listening on port " + port);
});
=======
var app = express();
>>>>>>> ecd6f344137ec12cc2a1302fa327930bcdda2fff:app.js

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
<<<<<<< HEAD:app
app.get('/query', routes.query);
app.get('/album', routes.albumpage);
app.get('/track', routes.trackdownload);
=======
app.get('/query', search.query);
app.get('/album', album.albumpage);
app.get('/track', album.trackdownload);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
>>>>>>> ecd6f344137ec12cc2a1302fa327930bcdda2fff:app.js
