'user strict';

// loading mongodb module
var mongoose    = require('mongoose');
var app         = require('./app');
var port        = process.env.PORT || 3977;    // application port

mongoose.Promise    = global.Promise;

mongoose
	.connect('mongodb://localhost:27017/or_spotify',
			function (err, res) {
				if(err) {
					throw err;
				} else {
					console.log('\n- - - - - - - - - - - - - - - - -\n');
					console.log('\tDatabase connected and running...');

					app.listen(port,
								function () {
									console.log('\tServer Running on http://localhost:'+ port);
									console.log('\n- - - - - - - - - - - - - - - - -\n');
								});
				}
			});
