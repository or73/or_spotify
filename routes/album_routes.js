'use strict';

var express         = require('express');
var AlbumController = require('../controllers/album_controller');

var api             = express.Router();
var md_auth         = require('../middlewares/authenticated');

var multipart       = require('connect-multiparty');
var md_upload       = multipart({ uploadDir: './uploads/albums' });


// ROUTES
// GET requirements
api
	.get('/album/:id',
		md_auth.ensureAuth,
		AlbumController.getAlbum)
	.get('/albums/:artist?',
		md_auth.ensureAuth,
		AlbumController.getAlbumsList)
	.get('/get-image-album/:imageFile',
		AlbumController.getImageFile);



// POST requirements
api
	.post('/album',
		md_auth.ensureAuth,
		AlbumController.saveAlbum)
	.post('/upload-image-album/:id', // url path
		[
			md_auth.ensureAuth, // token validation
			md_upload   // allows image upload
		],
		AlbumController.uploadImage);;



// PUT requirements
api
	.put('/album/:id',
		md_auth.ensureAuth,
		AlbumController.updateAlbum);



// DELETE requirements
api
	.delete('/album/:id',
		md_auth.ensureAuth,
		AlbumController.deleteAlbum);



module.exports  = api;
