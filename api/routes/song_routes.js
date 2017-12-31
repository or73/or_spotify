'use strict';

var express         = require('express');
var SongController  = require('../controllers/song_controller');
var api             = express.Router();
var md_auth         = require('../middlewares/authenticated');

var multipart       = require('connect-multiparty');
var md_upload       = multipart({ uploadDir: './uploads/songs' });



// ROUTES
// GET requirements
api
	.get('/song/:id',
		md_auth.ensureAuth,
		SongController.getSong)
	.get('/songs/:albumId?',
		md_auth.ensureAuth,
		SongController.getSongsList)
	.get('/get-file-song/:songFile',
		md_auth.ensureAuth,
		SongController.getSongFile);



// POST requirements
api
	.post('/song',
		md_auth.ensureAuth,
		SongController.saveSong)
	.post('/upload-file-song/:id', // url path
		[
			md_auth.ensureAuth, // token validation
			md_upload   // allows sound file upload
		],
		SongController.uploadSongFile);



// PUT requirements
api
	.put('/song/:id',
		md_auth.ensureAuth,
		SongController.updateSong);



// DELETE requirements
api
	.delete('/song/:id',
		md_auth.ensureAuth,
		SongController.deleteSong);



module.exports  = api;
