'use strict';

var path                = require('path');
var fs                  = require('fs');

var Artist              = require('../models/artist_model');
var Song                = require('../models/song_model');



function getSong(req, res) {
	let songId  = req.params.id;
	Song
		.findById(songId)//.findOne({ _id: songId })
		.populate({ path: 'album' })
		.exec((err, song) => {
		if (err) {
			res
				.status(500)
				.send({ message: 'Error[song-controller > getSong - 500 Internal Server Error]: The Song has not been saved' });
		} else {
			if (!song) {
				res
					.status(404)
					.send({ message: 'Error[song-controller > getSong - 404 Not Found]: The requested Song could not be loaded from DB' });
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
				.send({ message: 'Error[song_controller > saveSong - 500 Internal Server Error]: The Song has not been saved ' + err });
		} else {
			if (!songStored) {
				res
					.status(404)
					.send({ message: 'Error[song_controller > saveSong - 404 Not Found]: The requested Song could not be stored in DB' });
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
									.send({ message: 'Error[song_controller > getSongList - 500 Internal Server Error]: The Song has not been saved' });
							} else {
								if (!songs) {
									res
										.status(404)
										.send({ message: 'Error[song_controller > getSongList - 404 Not Found]: The requested Song could not be stored in DB' });
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
					.send({ message: 'Error[song_controller > updateSong - 500 Internal Server Error]: The Song has not been saved' });
			} else {
				if (!songUpdated) {
					res
						.status(404)
						.send({ message: 'Error[song_controller > updateSong - 404 Not Found]: The requested Song could not be stored in DB' });
				} else {
					res
						.status(200)
						.send({ songUpdated });
				}
			}
		});
}



function deleteSong(req, res) {
	let songId  = req.params.id;

	Song.findByIdAndRemove(songId,
							(err, songRemoved) => {
								if (err) {
									res
										.status(500)
										.send({ message: 'Error[song_controller > deleteSong - 500 Internal Server Error]: The Song has not been saved' });
								} else {
									if (!songRemoved) {
										res
											.status(404)
											.send({ message: 'Error[song_controller > deleteSong - 404 Not Found]: The requested Song could not be stored in DB' });
									} else {
										res
											.status(200)
											.send({ songRemoved });
									}
								}
							});
}



function uploadSongFile(req, res) {
	let songId      = req.params.id;
	let file_name   = 'Not file attached...';

	console.log('req: ', req);
	console.log('req.files: ', req.files);

	if (req.files) {
		let file_path   = req.files.file.path; // file to be upload
		let file_split  = file_path.split('\/');    // split file_path string to obtain file name, result is an array
		file_name   = file_split[2];    // obtain the second position, which contains file name

		console.log('file_split: ', file_split);

		let ext_split   = file_name.split('\.');
		let file_ext    = ext_split[1];

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
												.send({ message: 'Error[song_controller > uploadSongFile - 404 Not Found]: The requested Song File could not be upload to the DB ' });
										} else {
											res
												.status(200)
												.send({ song: songUpdated });
										}
									});
		} else {
			res
				.status(200)
				.send({ message: '[song_controller > uploadSongFile - 200 OK] Provided file is not an audio file...' });
		}

		console.log('filepath: ', file_path);
	} else {
		res
			.status(200)
			.send({ message: 'Error[song_controller > uploadSongFile - 404 Not Found]: The Audio File could not be uploaded... '});
	}
}



/**
 * extract a file from the Server
 */
function getSongFile (req, res) {
	console.log('[song_controller > getSongFile] req.params: ', req.params);
	let songFile   = req.params.songFile;
	let file_path   = './uploads/songs/' + songFile;

	fs.exists(file_path,
				function (exists) {
					console.log('[song_controller > getSongFile] exists: ', exists);
					if (exists) { // the file exists
						console.log('[song_controller > getSongFile]:  The Song File exists: ', songFile);
						res.sendFile(path.resolve(file_path));
					} else {
						console.log('[song_controller > getSongFile]:  The Song File does not exists ');
						res.status(404)
							.send({ message: 'Error[song_controller > getSongFile - 404 Not Found]: The Audio File does not exist...' });
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
