'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');

var app = express();   // express object



// loading routes
var user_routes     = require('./routes/user_routes');
var artist_routes   = require('./routes/artist_routes');
var album_routes    = require('./routes/album_routes');
var song_routes     = require('./routes/song_routes');



app.use(bodyParser.urlencoded({ extended: false }));    // bodyParser configuration
app.use(bodyParser.json());   // transform all requirements answers to JSON objects



// HTTP headers configuration
app
	.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*'); // Allows access to all our domains
		res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
		res.header('Allow', 'GET, POST, OPTIONS, PUT DELETE');

		next();
	});



// base routes
app.use('/api',
		user_routes);
app.use('/api',
		artist_routes);
app.use('/api',
		album_routes);
app.use('/api',
		song_routes);



module.exports = app;
