'use strict';

var path                = require('path');
var fs                  = require('fs');
var mongoosePagination  = require('mongoose-pagination');

var Artist              = require('../models/artist_model');
var Album               = require('../models/album_model');
var Song                = require('../models/song_model');



function getSong(req, res) {
	/*res
		.status(200)
		.send({ message: '[200 OK]: Song Controller'});*/
	var songId  = req.params.id;

	Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[500 Internal Server Error]: The Song has not been saved' });
		} else {
			if (!song) {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The requested Song could not be loaded from DB' });
			} else {
				res
					.status(200)
					.send({ song: song });
			}
		}
	});
}



function saveSong(req, res) {
	var song    = new Song();
	var params  = req.body;

	song.name       = params.name;
	song.number     = params.number;
	song.duration   = params.duration;
	song.file       = 'null';
	song.album      = params.album;

	song.save((err, songStored) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[500 Internal Server Error]: The Song has not been saved ' + err });
		} else {
			if (!songStored) {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The requested Song could not be stored in DB' });
			} else {
				res
					.status(200)
					.send({ songStored });
			}
		}
	});
}



function getSongsList(req, res) {
	var albumId = req.params.albumId;

	if (!albumId) {
		var find    = Song.find({}).sort('number');
	} else {
		var find    = Song.find({ album: albumId }).sort('number');
	}

	find.populate({
					path: 'album',
					populate: {
								path: 'artist',
								model: 'Artist'
							}
				}).exec(function (err, songs) {
							if (err) {
								res
									.status(500)
									.send({ message: 'Error[500 Internal Server Error]: The Song has not been saved' });
							} else {
								if (!songs) {
									res
										.status(404)
										.send({ message: 'Error[404 Not Found]: The requested Song could not be stored in DB' });
								} else {
									res
										.status(200)
										.send({ songs });
								}
							}
						});
}



function updateSong(req, res) {
	var songId  = req.params.id;
	var update  = req.body;

	Song.findByIdAndUpdate(songId,
							update,
							(err, songUpdated) => {
								if (err) {
				res
					.status(500)
					.send({ message: 'Error[500 Internal Server Error]: The Song has not been saved' });
			} else {
				if (!songUpdated) {
					res
						.status(404)
						.send({ message: 'Error[404 Not Found]: The requested Song could not be stored in DB' });
				} else {
					res
						.status(200)
						.send({ songUpdated });
				}
			}
		});
}



function deleteSong(req, res) {
	var songId  = req.params.id;

	Song.findByIdAndRemove(songId,
		(err, songRemoved) => {
			if (err) {
				res
					.status(500)
					.send({ message: 'Error[500 Internal Server Error]: The Song has not been saved' });
			} else {
				if (!songRemoved) {
					res
						.status(404)
						.send({ message: 'Error[404 Not Found]: The requested Song could not be stored in DB' });
				} else {
					res
						.status(200)
						.send({ songRemoved });
				}
			}
		});
}



function uploadSongFile(req, res) {
	var songId      = req.params.id;
	var file_name   = 'Not file attached...';

	console.log('req: ', req);
	console.log('req.files: ', req.files);

	if (req.files) {
		var file_path   = req.files.file.path; // file to be upload
		var file_split  = file_path.split('\/');    // split file_path string to obtain file name, result is an array
		file_name   = file_split[2];    // obtain the second position, which contains file name

		console.log('file_split: ', file_split);

		var ext_split   = file_name.split('\.');
		var file_ext    = ext_split[1];

		// validate if uploaded file has right extension
		if (file_ext === 'mp3' || file_ext === 'ogg') {
			Song
				.findByIdAndUpdate(songId,
					{
						file: file_name    // update file name on user object
					},
					(err, songUpdated) => {
						if (!songUpdated) {
							res
								.status(404)
								.send({ message: 'Error[404 Not Found]: The requested Song File could not be upload to the DB ' });
						} else {
							res
								.status(200)
								.send({ song: songUpdated });
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
			.send({ message: 'Error[404 Not Found]: The Audio File could not be uploaded... '});
	}
}



/**
 * extract a file from the Server
 */
function getSongFile (req, res) {
	var songFile   = req.params.songFile;
	var file_path   = './uploads/songs/' + songFile;

	fs.exists(file_path,
		function (exists) {
			if (exists) { // the file exists
				res
					.sendFile(path.resolve(file_path));
			} else {
				res
					.status(404)
					.send({ message: 'Error[404 Not Found]: The Audio File does not exist...' });
			}
		});    // validates if provided files exists on server
}



module.exports = {
					deleteSong,
					getSongFile,
					getSong,
					getSongsList,
					saveSong,
					updateSong,
					uploadSongFile
				};
