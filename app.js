
/**
 * Module dependencies.
 */

var express = require('express'),
	app = express(),
	redis = require('redis'),
	server = require('http').createServer(app),
	socket = require('socket.io'),
	io = socket.listen(server);

io.set('store', new socket.RedisStore());
// all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
// app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(3000);

io.of('/chat')
.on('connection', function (socket) {
	socket.emit('msg', {
	    msg: 'Welcome to Talkr!',
	    from: 'Talkr',
	    created: new Date().getTime()
	});
	// console.log('socket:', socket);
	socket.on('msg', function (msgObj) {
	  socket.broadcast.emit('msg', msgObj);
	});
});




