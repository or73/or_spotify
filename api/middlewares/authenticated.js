'use strict';

var jwt     = require('jwt-simple');    // token validation
var moment  = require('moment');    // to validate token per time of life
var secret  = 'secret_string_for_token_creation';   // string to create hash for token

exports.ensureAuth  = function (req, res, next) {
						console.log('[middlewares - authenticated > ensureAuth]: ', req.headers.authorization);
						// collect authorization
						if (!req.headers.authorization) {
							return res
									.status(403)
									.send({ message: 'Error 403 [middleware > ensureAuth - authenticated]: Requirement does not contains the authentication header' });
						}
						var token   = req.headers.authorization.replace(/['"]+/g, '');

						try {
							var payload = jwt.decode(token, secret);    // token decodification

							if (payload.exp <= moment().unix()) {   // expiration data and current date comparison for expiration time validation
								return res
										.status(401)
										.send({ message: 'middleware > ensureAuth - Expired token' });
							}
						} catch (e) {
							console.log('Error: middleware > ensureAuth - Not valid token - ', e);
							return res
									.status(404)
									.send({ message: 'middleware > ensureAuth - Not valid token' });
						}

						req.user   = payload;   // adding a property 'user' to req, which contains all user data
						next(); // exit from current function
					};
