'use strict';

var path    = require('path');
var fs      = require('fs');
var mongoosePagination  = require('mongoose-pagination');


var Artist  = require('../models/artist_model');
var Album   = require('../models/album_model');
var Song    = require('../models/song_model');



function getAlbum(req, res) {
	/*res
		.status(200)
		.send({ message: 'getAlbum Action' });*/
	var albumId = req.params.id;

	Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[500 Internal Server Error]: Request error' });
		} else {
			if (!album) {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The requested Album could not be find in DB' });
			} else {
				res
					.status(200)
					.send({ album });
			}
		}
	});   // loading and storing artist data into Album
}



function saveAlbum(req, res) {
	var album   = new Album();

	var params  = req.body;

	album.title = params.title;
	album.description   = params.description;
	album.year          = params.year;
	album.image         = 'null';
	album.artist        = params.artist;

	album.save((err, albumStored) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[500 Internal Server Error]: Request error' });
		} else {
			if (!albumStored) {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The requested Album could not be stored in DB' });
			} else {
				res
					.status(200)
					.send({ album: albumStored });
			}
		}
	});
}



function getAlbumsList(req, res) {
	var artistId    = req.params.artist;
	console.log('artistId: ', artistId);

	if (!artistId) {
		// Extract all albums from DB
		var find    = Album.find({}).sort('title');
	} else {
		// Extract all albums of an specified Artist
		var find    = Album.find({ artist: artistId }).sort('year');
	}

	find.populate({ path: 'artist' }).exec((err, albums) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[500 Internal Server Error]: Request Error' });
		} else {
			if (!albums) {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The requested Albums could not be find in DB' });
			} else {
				res
					.status(200)
					.send({ albums });
			}
		}
	});  // which property contains the id of an external object
}



function updateAlbum(req, res) {
	var albumId = req.params.id;
	var update  = req.body;

	Album.findByIdAndUpdate(albumId,
							update,
							(err, albumUpdated) => {
								if (err) {
									res
										.status(500)
										.send({ message: 'Error[500 Internal Server Error]: Request Error' });
								} else {
									if (!albumUpdated) {
										res
											.status(404)
											.send({ message: 'Error[404 Not Found]: The requested Albums could not be updated in DB' });
									} else {
										res
											.status(200)
											.send({ album: albumUpdated });
									}
								}
							});
}



function deleteAlbum(req, res) {
	var albumId = req.params.id;

	Album
		.findByIdAndRemove(albumId,
							(err, albumRemoved) => {
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
															.send({ album: albumRemoved });
													}
												}
											});
									}
								}
							});
}



function uploadImage(req, res) {
	var albumId    = req.params.id;
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
			Album
				.findByIdAndUpdate(albumId,
					{
						image: file_name    // update file name on user object
					},
					(err, albumUpdated) => {
						if (!albumUpdated) {
							res
								.status(404)
								.send({ message: 'Error[404 Not Found]: The requested Artist image could not be upload to the DB' });
						} else {
							res
								.status(200)
								.send({ album: albumUpdated });
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
	var file_path   = './uploads/albums/' + imageFile;

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
						deleteAlbum,
						getAlbum,
						getAlbumsList,
						getImageFile,
						saveAlbum,
						updateAlbum,
						uploadImage
					};
