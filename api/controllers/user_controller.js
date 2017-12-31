'use strict';

var fs      = require('fs');    // allows access to file sytem
var path    = require('path');  // allows access to specific/desired paths

var bcrypt  = require('bcrypt-nodejs');
var User    = require('../models/user_model');  // Loading user_model
var jwt     = require('../services/jwt');



function pruebas(req, res) {
	res
		.status(200)
		.send({ message: 'Testing user_controller functionality' });
}



/**
 * To save user to DB
 */
function saveUser(req, res) {
	var user    = new User();   // new user instance

	var params  = req.body; // parameters from req.body

	console.log('saveUsers [params]: ', params);

	user.name       = params.name;
	user.surname    = params.surname;
	user.email      = params.email;
	user.role       = 'ROLE_ADMIN';
	user.image      = 'null';

	// saving user data to DB
	if (params.password) {
		// encrypt password and save it
		bcrypt
			.hash(params.password,
				null,
				null,
				function (err, hash) {
					user.password   = hash;

					// user data validation
					if (user.name != null && user.surname != null && user.email != null) {
						// save user data to DB
						user.save((err, userStored) => {
															if (err) {
																res
																	.status(500)
																	.send({ message: 'Error[500 Internal Server Error]: saving the user data' });
															} else {
																if (!userStored) {
																	res
																		.status(404)
																		.send({message: 'Error[404 Not Found]: The requested User could not be saved in DB' });
																} else {
																	res
																		.status(200)
																		.send({ user: userStored });
																}
															}});
					} else {
						res
							.status(200)
							.send({ message: '[200 OK]:All fields are required' });
					}
				});
	} else {
		res
			.status(200)
			.send({ message: '[200 OK - saveUser]: Password input required' });
	}
}



/** *
 * validates user login - username and password
 */
function loginUser(req, res) {
	var params      = req.body; // parameters from req.body

	var email       = params.email;
	var password    = params.password;

	// find user by  email
	User
		.findOne({ email: email.toLowerCase() },
					(err,  user) => {
										if (err) {
											res
												.status(500)
												.send({ message: 'Error[500 Internal Server Error]: wrong requirement' });
										} else {
											if (!user) {
												res
													.status(404)
													.send({ message: 'Error[404 Not Found]: The requested User could not be find in DB' });
											} else {
												// password comparison and validation
												bcrypt
													.compare(password,
															user.password,
															function (err, check) {
																if (check) {
																	// return user data
																	if (params.gethash) {
																		// creates and return a jwt token
																		res
																			.status(200)
																			.send({ token: jwt.createToken(user) });
																	} else {
																		res
																			.status(200)
																			.send({ user });
																	}
																} else {
																	// return error by wrong validation data
																	res
																		.status(404)
																		.send({ message: 'Error[404 Not Found]: The requested User could not be find in DB - Wrong user data for validation' });
																}
															});
											}
										}
									});
}



function updateUser(req, res) {
	var userId  = req.params.id;    // obtain user 'id' from url
	var update  = req.body; // all user data

	User
		.findByIdAndUpdate(userId,
						update,
						(err,  userUpdated) => {
													if (err) {
														res
															.status(500)
															.send({message: 'Error[500 Internal Server Error]: updating user data'})
													} else {
														if (!userUpdated) {
															res
																.status(404)
																.send({ message: 'Error[404 Not Found]: The requested User could not be updated in DB' })
														} else {
															res
																.status(200)
																.send({ user: userUpdated });
														}
													}
						});
}



function uploadImage(req, res) {
	var userId      = req.params.id;
	var file_name   = 'No uploaded...';

	if (req.files) {
		var file_path   = req.files.image.path; // file to be upload
		var file_split  = file_path.split('\/');    // split file_path string to obtain file name, result is an array
		var file_name   = file_split[2];    // obtain the second position, which contains file name

		console.log('file_split: ', file_split);

		var ext_split   = file_name.split('\.');
		var file_ext    = ext_split[1];

		// validate if uploaded file has right extension
		if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
			User
				.findByIdAndUpdate(userId,
									{
										image: file_name    // update file name on user object
									},
									(err, userUpdated) => {
											if (!userUpdated) {
												res
													.status(404)
													.send({ message: 'Error[404 Not Found]: The requested User Image could not be upload in DB' });
											} else {
												res
													.status(200)
													.send({ user: userUpdated,
															image: file_name});
											}
									});
		} else {
			res
				.status(200)
				.send({ message: 'Provided file is not an image...' });
		}

		console.log('filepath: ', file_path);
	} else {
		res
			.status(200)
			.send({ message: 'image not uploaded... '});
	}
}


/**
 * extract a file from the Server
 */
function getImageFile (req, res) {
	var imageFile   = req.params.imageFile;
	var file_path   = './uploads/users/' + imageFile;

	fs.exists(file_path,
			function (exists) {
				if (exists) { // the file exists
					res
						.sendFile(path.resolve(file_path));
				} else {
					res
						.status(200)
						.send({ message: 'Error[404 Not Found]: The requested Image could not be found...' });
				}
			});    // validates if provided files exists on server
}



module.exports = {  pruebas,
					getImageFile,
					loginUser,
					saveUser,
					updateUser,
					uploadImage};
