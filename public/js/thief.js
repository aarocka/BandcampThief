var socket;

$(document).ready(function() {
  socket = io.connect();

  socket.on('progress', function(details) {
    //console.log(details);
    $('#progressbar').css('width', details.progressSize + '%');
  });
});
