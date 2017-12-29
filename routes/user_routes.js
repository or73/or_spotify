'use strict';

var express         = require('express');
var UserController  = require('../controllers/user_controller');

var api             = express.Router(); // allows routes creation
var md_auth         = require('../middlewares/authenticated');  // middleware

var multipart       = require('connect-multiparty');    // allows files upload
var md_upload       = multipart({ uploadDir: './uploads/users' });  // path for data image upload



// GET requirements
api
	.get('/pruebas',
		md_auth.ensureAuth,
		UserController.pruebas)
	.get('/get-image-user/:imageFile',
		UserController.getImageFile);    // UserController function



// POST requirements
api
	.post('/register',
		UserController.saveUser)
	.post('/login',
		UserController.loginUser)
	.post('/upload-image-user/:id', // url path
		[
			md_auth.ensureAuth, // token validation
			md_upload   // allows image upload
		],
		UserController.uploadImage);



// PUT requirements
api
	.put('/update-user/:id',    // url path
		md_auth.ensureAuth, // token validation
		UserController.updateUser); // UserController function

module.exports  = api;
