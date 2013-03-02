var io;

module.exports = function init(lio) {
	io = lio;
	return eexports;
}

eexports = {
	index: index,
	albumpage: require('./albumpage')(io),
	search: require('./user')(io)
}

function index(req, res){
	res.render('index', { title: 'Bandcamp Thief' });
}

