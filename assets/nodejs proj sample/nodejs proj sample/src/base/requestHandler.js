// @author: Manish Jain
// Created on: 2022-07-17 09:46 AM
// Description: To handle and process request.

"use strict";

module.exports = {
	// Function that executes logic based on request.
	execute: function (sourcePath, req, res, appEnv, sessionValidate, serveFromCache = null, privilegedAccess = null) {
		// Handling HPP
		// if (req.query.hasOwnProperty('event_source') && !req.queryPolluted.hasOwnProperty('event_source'))
		// {
		// 	req.queryPolluted.event_source = JSON.parse(JSON.stringify(req.query.event_source));
		// }

		// try
		// {
		// 	serveFromCache = (serveFromCache != null ? serveFromCache : appEnv.envConfig.GENERAL_CACHE_CONTROL_FLAG);
		// }
		// catch(e)
		// {
		// 	serveFromCache = 1;
		// }

		let continueProcess = function () {
			try {
				let orderedQueryParams = {};
				Object.keys(req.query).sort().forEach(function (key) {
					orderedQueryParams[key] = req.query[key];
				});

				let validateRequest = require(appEnv.appPath + '/src/base/requestValidator').validateRequest;

				validateRequest(appEnv, req, function (status) {
					if (status == true) {
						if (serveFromCache == 1) {
							const crypto_sh256 = require("crypto-js/sha256");

							let cache_handler = require(appEnv.appPath + '/src/base/cacheHandler');
							cache_handler.getFromCache((appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)) >= 0 ? appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)) : 0), appEnv, appEnv.sessionOBJ.getSessionValue(req, appEnv, "organization_id"), crypto_sh256(req.protocol + '://' + req.get('host') + req.path + JSON.stringify(orderedQueryParams) + appEnv.sessionOBJ.getSessionValue(req, appEnv, "organization_id")).toString(), function (responseData) {
								if (responseData == null) {
									// Continue with normal computation if nothing is found in cache.
									let urlLogicOBJ = require(appEnv.appPath + sourcePath);
									urlLogicOBJ.main(req, res, appEnv);
								}
								else {
									appEnv.responseGenerator.sendResponse(res, false, 200, JSON.parse(JSON.stringify(responseData)), 0, null);
								}
							});
						}
						else {
							// Continue with normal computation if nothing is found in cache.
							let urlLogicOBJ = require(appEnv.appPath + sourcePath);
							urlLogicOBJ.main(req, res, appEnv);
						}
					}
					else {
						let returnStatus = {
							"status": "error",
							"description": "Conflicting parameters."
						};
						res.status(409);
						res.send(returnStatus);
					}
				});
			}
			catch (e) {
				console.error(e);
				let returnStatus = {
					"status": "error",
					"description": "Oops! Something went wrong while processing your request."
				};
				res.status(500);
				res.send(returnStatus);
				return;
			}
		};

		let terminateProcess = function (statusCode) {
			if (statusCode == 1) {
				let returnStatus = {
					"status": "error",
					"description": "Access token expired."
				};
				res.status(401);
				res.send(returnStatus);
			}
			else if (statusCode == 2) {
				let returnStatus = {
					"status": "error",
					"description": "Forbidden! Access denied."
				};
				res.status(403);
				res.send(returnStatus);
			}
			else {
				let returnStatus = {
					"status": "error",
					"description": "Unauthorized access!"
				};
				res.status(401);
				res.send(returnStatus);
			}
			return;
		};

		let eventPushLogVerified = function () {
			try {
				let urlLogicOBJ = require(appEnv.appPath + sourcePath);
				urlLogicOBJ.main(req, res, appEnv);
			}
			catch (e) {
				console.error(e);
				let returnStatus = {
					"status": "error",
					"description": "Oops! Something went wrong while processing your request."
				};
				res.status(500);
				res.send(returnStatus);
				return;
			}
		};

		let terminatePushLogVerified = function () {
			let returnStatus = {
				"status": "error",
				"description": "Unauthorized access, request could not be validated."
			};
			res.status(401);
			res.send(returnStatus);
			return;
		};

		if ([1, -1].includes(sessionValidate)) {
			let defaultAccessRoles = ["master_admin", "client", "reporting_manager", "distributor", "operator", "policy_holder"];

			if (privilegedAccess != null && typeof privilegedAccess == 'object') {
				defaultAccessRoles = defaultAccessRoles.concat(privilegedAccess);
			}

			if (sessionValidate == 1) {
				appEnv.sessionOBJ.validateSession(req, appEnv, continueProcess, terminateProcess, defaultAccessRoles);
			}
			else {
				let urlLogicOBJ = require(appEnv.appPath + sourcePath);
				urlLogicOBJ.main(req, res, appEnv);
			}
		}
		else if (sessionValidate == 2) {
			appEnv.sessionOBJ.validateAnalyticsPushRequest(req, appEnv, eventPushLogVerified, terminatePushLogVerified);
		}
		else if (sessionValidate == 3) {
			appEnv.sessionOBJ.validateInternalRequest(req, appEnv, eventPushLogVerified, terminatePushLogVerified);
		}
		else if (sessionValidate == 4) {
			appEnv.sessionOBJ.validateInternalServicesRequest(req, appEnv, eventPushLogVerified, terminatePushLogVerified);
		}
		else {
			let urlLogicOBJ = require(appEnv.appPath + sourcePath);
			urlLogicOBJ.main(req, res, appEnv);
		}
	},

	// Function that render page on request.
	render: function (sourcePath, renderData, req, res, appEnv, sessionValidate) {
		let continueRender = function () {
			if (appEnv.sessionOBJ.getCookie(req, '_clt') == null) {
				appEnv.sessionOBJ.setCookie(res, { "_jsi": appEnv.sessionOBJ.getCookie(req, "_jsi").toString(), "_lpt": appEnv.sessionOBJ.getCookie(req, "_lpt").toString() }, false);
			}
			res.render(sourcePath, renderData);
		};

		let terminateRender = function () {
			if (req.xhr == true) {
				let returnStatus = {
					"status": "error",
					"description": "Unauthorized access!"
				};
				res.status(401);
				res.send(returnStatus);
				return;
			}
			else {
				if (appEnv.appInfo.appName == "guideme_analytics") {
					res.writeHead(302, { Location: '/admin/' });
				}
				res.end();
			}
		};

		if (sessionValidate == true) {
			appEnv.sessionOBJ.validateSession(req.cookies, appEnv, continueRender, terminateRender);
		}
		else {
			res.render(sourcePath);
		}
	}
};
