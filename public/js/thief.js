var socket;

$(document).ready(function() {
  socket = io.connect();
  done = "<i class='icon-ok'></i>  ";

  socket.on('progress', function(details) {
    //console.log(details);
    $('#progressbar').css('width', Math.floor((details.tracksCompleted / details.totalTracks) * 100) + '%');
    //console.log('Finished: ' + details.tracksCompleted + ' / ' + details.totalTracks);
  });
  socket.on('finished', function(track) {
    var li = $('li')[track.track.number - 1];
    li.innerHTML = done + li.innerHTML;
    //console.log(track.track.title);
  });
});
