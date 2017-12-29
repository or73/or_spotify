'use strict';

var jwt     = require('jwt-simple');    // token validation
var moment  = require('moment');    // to validate token per time of life
var secret  = 'secret_string_for_token_creation';   // string to create hash for token

exports.createToken  = function (user) {
							var payload = { // data to be encrypted
											sub: user._id,
											name: user.name,
											surname: user.surname,
											email: user.email,
											role: user.role,
											image: user.image,
											iat: moment().unix(),   // token date of creation
											exp: moment().add(30, 'days').unix  // token date of expiration
										};

							return jwt.encode(payload,
											secret);
						};
