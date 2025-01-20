"use strict";

module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		try {
			const CapitalizeName = require("../utilities/name_parser");
			let { corporate_name = "", mobile = "", mobile_2 = null, landline = null, email = "", secondary_email = null, remarks = "", client_logo_id = null, client_code = "" } = req.body;

			// Capitalizing corporate name;
			corporate_name = CapitalizeName(corporate_name);

			const Client = require('node-rest-client').Client;
			const node_client = new Client();

			// Check if user with the given mobile number already exists
			appEnv.postgreQryBldr.executeQuery(0, `SELECT usr.id FROM users usr WHERE usr.mobile = $1;`, [mobile], (err, result) => {
				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					if (result.length > 0) {
						// User exists
						appEnv.responseGenerator.sendResponse(res, false, 200, "Client with this mobile number already exists", "", "", null);
						return;
					}

					if (!mobile || mobile == "") {

						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Mobile number is required.", null);
						return;
					}

					// User does not exist, proceed with user creation
					const args = {
						data: {
							user_name: corporate_name.replace(/\s+/g, '_') + "_" + mobile,
							mobile,
							email,
							role: "client"
						},
						headers: { 'Content-Type': 'application/json', 'AccessToken': req.headers.accesstoken }
					};
					let user_id = null;

					node_client.post(appEnv.envConfig.APP_BASE_DOMAIN[0] + '/user/api/v1/create_user/', args, function (raw_data, raw_response) {
						try {
							user_id = raw_data.data[0].id;

							appEnv.postgreQryBldr.executeQuery(0, `INSERT INTO client (user_id, corporate_name, mobile, mobile_2, landline, email, secondary_email, remarks, client_logo_id, client_code, distributors_count, operators_count, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, (SELECT COUNT(*) FROM distributor WHERE client_id = $1), (SELECT COUNT(*) FROM operator WHERE client_id = $1), $11) RETURNING *;`, [user_id, corporate_name, mobile, mobile_2, landline, email, secondary_email, remarks, client_logo_id, client_code, created_updated_by], (err, data) => {
								try {
									if (err) {

										appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));

										// Delete the user since client creation failed
										appEnv.postgreQryBldr.executeQuery(0, `DELETE FROM users WHERE id = $1;`, [user_id], (err, data) => {
											try {
												if (err) {

													appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
												}

												appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Delete user failed.", null);
												return;
											}
											catch (err) {

												appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
												appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
												return;
											}
										});
									}
									else {

										appEnv.responseGenerator.sendResponse(res, false, 200, data, "", "Client created successfully.", null);
										return;
									}
								}
								catch (err) {

									appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
									appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
									return;
								}
							});
						}
						catch (err) {

							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));

							if (user_id != null) {
								// Delete the user since client creation failed
								appEnv.postgreQryBldr.executeQuery(0, `DELETE FROM users WHERE id = $1;`, [user_id], (err, data) => {
									if (err) {

										appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
									}

									appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
									return;
								});
							}
							else {

								appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
								return;
							}
						}
					});
				}
				catch (err) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
					return;
				}
			});
		}
		catch (err) {

			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
			return;
		}
	}
};