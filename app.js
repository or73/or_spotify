'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');

var app = express();   // express object



// loading routes
var user_routes     = require('./routes/user_routes');
var artist_routes   = require('./routes/artist_routes');
var album_routes    = require('./routes/album_routes');



app.use(bodyParser.urlencoded({ extended: false }));    // bodyParser configuration
app.use(bodyParser.json());   // transform all requirements answers to JSON objects



// HTTP headers configuration



// base routes
app.use('/api',
		user_routes);
app.use('/api',
		artist_routes);
app.use('/api',
		album_routes);



module.exports = app;
