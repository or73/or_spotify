'use strict';

var path                = require('path');
var fs                  = require('fs');
var mongoosePagination  = require('mongoose-pagination');

var Artist  = require('../models/artist_model');
var Album   = require('../models/album_model');
var Song    = require('../models/song_model');



function getArtist(req, res) {
	var artistId = req.params.id;

	Artist.findById(artistId,
		(err, artist) => {
			if (err) {
				res
					.status(500)
					.send({ message: 'Error[500 Internal Server Error]: not succesful requirement' });
			} else {
				if (!artist) {
					res
						.status(404)
						.send({ message: 'Error[404 Not Found]: the user does not exist' });
				} else {
					res
						.status(200)
						.send({ artist });
				}
			}
		});
}



function saveArtist(req, res) {
	var artist  = new Artist();   // new Artist instance

	var params  = req.body; // parameters from req.body

	console.log('saveArtist: ', params);

	artist.name         = params.name;
	artist.description  = params.description;
	artist.image        = 'null';

	artist.save((err, artistStored) => {
											if (err) {
												res
													.status(500)
													.send({ message: 'Error[500 Internal Server Error]: Saving the artist'});
											} else {
												if (!artistStored) {
													res
														.status(404)
														.send({ message: 'Error[404 Not Found]: The Artist has not been saved' });
												} else {
													res
														.status(200)
														.send({ artist: artistStored });
												}
											}
										});
}



function getArtistsList(req, res) {
	if (req.params.page) {
		var page    = req.params.page;
	} else {
		var page    = 1;
	}

	var itemsPerPage    = 3;

	Artist
		.find()
		.sort('name')
		.paginate(page,
				itemsPerPage,
				function (err, artists, total) {
					if (err) {
						res
							.status(500)
							.send({ message: 'Error[500 Internal Server Error]: In requirement' });
					} else {
						if (!artists) {
							res
								.status(404)
								.send({ message: 'Error[404 Not Found]: The requested Artists could not be find in DB' });
						} else {
							return res
									.status(200)
									.send({ total_items: total,
											artists: artists });
						}
					}
				});
}



function updateArtist(req, res) {
	var artistId    = req.params.id;
	var update      = req.body;

	Artist
		.findByIdAndUpdate(artistId,
							update,
			(err, artistUpdated) => {
				if (err) {
					res
						.status(500)
						.send({ message: 'Error[500 Internal Server Error]: The Artist has not been saved' });
				} else {
					if (!artistUpdated) {
						res
							.status(404)
							.send({ message: 'Error[404 Not Found]: The requested Albums could not be updated in DB' });
					} else {
						res
							.status(200)
							.send({ artist: artistUpdated });
					}
				}
			});
}



function deleteArtist(req, res) {
	var artistId    = req.params.id;

	Artist
		.findByIdAndRemove(artistId,
			(err, artistRemoved) => {
				if (err) {
					res
						.status(500)
						.send({ message: 'Error[500 Internal Server Error]: The Artist list has not been loaded' });
				} else {
					if (!artistRemoved) {
						res
							.status(404)
							.send({ message: 'Error[404 Not Found]: The requested Artist could not be delete in DB' });
					} else {
						/*res
							.status(200)
							.send({ message: 'The Artist has been removed' });*/

						// deleting all associated albums
						Album
							.find({ artist: artistRemoved._id })
							.remove((err, albumRemoved) => {
								if (err) {
									res
										.status(500)
										.send({ message: 'Error[500 Internal Server Error]: The Album has not been loaded' });
								} else {
									if (!albumRemoved) {
										res
											.status(404)
											.send({ message: 'Error[404 Not Found]: The requested Album could not be delete in DB' });
									} else {
										/*res
											.status(200)
											.send({ message: 'The Album has been removed' });*/
										// deleting all associated songs
										Song
											.find({ song: albumRemoved._id })
											.remove((err, songRemoved) => {
												if (err) {
													res
														.status(500)
														.send({ message: 'Error[500 Internal Server Error]: The Song has not been loaded' });
												} else {
													if (!songRemoved) {
														res
															.status(404)
															.send({ message: 'Error[404 Not Found]: The requested Song could not be find in DB' });
													} else {
														res
															.status(200)
															.send({ artist: artistRemoved });
													}
												}
											});
									}
								}
							});
					}
				}
			});
}



function uploadImage(req, res) {
	var artistId    = req.params.id;
	var file_name   = 'Not file attached...';

	if (req.files) {
		var file_path   = req.files.image.path; // file to be upload
		var file_split  = file_path.split('\/');    // split file_path string to obtain file name, result is an array
		var file_name   = file_split[2];    // obtain the second position, which contains file name

		console.log('file_split: ', file_split);

		var ext_split   = file_name.split('\.');
		var file_ext    = ext_split[1];

		// validate if uploaded file has right extension
		if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
			Artist
				.findByIdAndUpdate(artistId,
					{
						image: file_name    // update file name on user object
					},
					(err, artistUpdated) => {
						if (!artistUpdated) {
							res
								.status(404)
								.send({ message: 'Error[404 Not Found]: The requested Artist image could not be upload to the DB' });
						} else {
							res
								.status(200)
								.send({ artist: artistUpdated });
						}
					});
		} else {
			res
				.status(200)
				.send({ message: '[200 OK]Provided file is not an image...' });
		}

		console.log('filepath: ', file_path);
	} else {
		res
			.status(200)
			.send({ message: 'Error[404 Not Found]: The image could not be uploaded... '});
	}
}



/**
 * extract a file from the Server
 */
function getImageFile (req, res) {
	var imageFile   = req.params.imageFile;
	var file_path   = './uploads/artists/' + imageFile;

	fs.exists(file_path,
		function (exists) {
			if (exists) { // the file exists
				res
					.sendFile(path.resolve(file_path));
			} else {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The Image does not exist...' });
			}
		});    // validates if provided files exists on server
}



module.exports  = {
						deleteArtist,
						getArtist,
						getArtistsList,
						getImageFile,
						saveArtist,
						updateArtist,
						uploadImage
					};
