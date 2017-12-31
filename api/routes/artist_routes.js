'use strict';

var express             = require('express');
var ArtistController    = require('../controllers/artist_controller');
var multipart           = require('connect-multiparty');    // allows files upload
var md_upload           = multipart({ uploadDir: './uploads/artists' });  // path for data image upload

var api                 = express.Router(); // allows get, put, post methods
var md_auth             = require('../middlewares/authenticated');  // authentication middleware - allows restriction to only authorized users


// Routes
// GET requirements
api
	.get('/artist/:id',
		md_auth.ensureAuth,
		ArtistController.getArtist)
	.get('/artists/:page?',
		md_auth.ensureAuth,
		ArtistController.getArtistsList)
	.get('/get-image-artist/:imageFile',
		ArtistController.getImageFile);



// POST requirements
api
	.post('/artist',
		md_auth.ensureAuth,
		ArtistController.saveArtist)
	.post('/upload-image-artist/:id', // url path
		[
			md_auth.ensureAuth, // token validation
			md_upload   // allows image upload
		],
		ArtistController.uploadImage);



// PUT requirements
api
	.put('/artist/:id',
		md_auth.ensureAuth,
		ArtistController.updateArtist);



// DELETE requirements
api
	.delete('/artist/:id',
		md_auth.ensureAuth,
		ArtistController.deleteArtist);



module.exports  = api;
