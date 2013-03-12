#!/usr/bin/env node

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , path = require('path');

var port = process.env.PORT || 3000;

global.io = io;

server.listen(port, function() {
  console.log("Express server listening on port " + port);
});

io.configure(function() {
  io.set('log level', 2);
});

app.configure(function() {
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
app.get('/query', routes.query);
app.get('/album', routes.albumpage);
app.get('/track', routes.trackdownload);

io.sockets.on('connection', function(socket) {
  socket.on('begin', function(album) {
    if (!album.id) return;
    routes.downloader.downloadAlbum(album.id);
  });
});
