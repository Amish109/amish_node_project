"use strict";
module.exports = {
	main: function (req, res, appEnv) {
		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

		try {
			let { client_id = "", corporate_name = "", mobile = "", mobile_2 = null, landline = null, email = "", secondary_email = null, password = "", remarks = "", client_logo_id = null } = req.body;

			if (!client_id) {

				appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Client ID is required", null);
				return;
			}

			try {
				appEnv.postgreQryBldr.executeQuery(0, `
					SELECT usr.id FROM users usr WHERE usr.mobile = $1 AND usr.is_obsolete = 0;
				`, [mobile], (err, existingMobileData) => {

					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}


					if (existingMobileData.length > 0) {
						try {
							appEnv.postgreQryBldr.executeQuery(0, `
								SELECT clnt.user_id FROM client clnt WHERE clnt.id = $1 AND clnt.is_obsolete = 0;
							`, [client_id], (err, clientData) => {
								if (err) {

									appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
									appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
									return;
								}

								const currentUserId = clientData[0]?.user_id;

								if (existingMobileData[0].id != currentUserId) {

									appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
									appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Mobile number already exists", null);
									return;
								}

								try {
									appEnv.postgreQryBldr.executeQuery(0, `
										UPDATE client
										SET corporate_name = $1, mobile = $2, mobile_2 = $3, landline = $4, email = $5, secondary_email = $6, remarks = $7, updated_by = $8, updated_at = NOW(), client_logo_id = $9
										WHERE id = $10 RETURNING *;
									`, [corporate_name, mobile, mobile_2, landline, email, secondary_email, remarks, created_updated_by, client_logo_id, parseInt(client_id)], (err, data) => {

										if (err) {

											appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
											appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
											return;
										}

										// Update the corresponding user information
										try {
											appEnv.postgreQryBldr.executeQuery(0, `
												UPDATE users
												SET user_name = $1, mobile = $2, email = $3, password = $4, updated_by = $5
												WHERE id = (SELECT user_id FROM client WHERE id = $6) RETURNING *;
											`, [corporate_name + "_" + mobile, mobile, email, password, created_updated_by, client_id], (err, data) => {

												if (err) {

													appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
													appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
													return;
												}

												appEnv.responseGenerator.sendResponse(res, false, 200, null, "", "Client and associated user updated successfully.", null);
												return;
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
							});
						}
						catch (err) {

							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
							return;
						}
					}
					else {

						try {
							appEnv.postgreQryBldr.executeQuery(0, `
								UPDATE client
								SET corporate_name = $1, mobile = $2, mobile_2 = $3, landline = $4, email = $5, secondary_email = $6, remarks = $7, updated_by = $8
								WHERE id = $9 RETURNING *;
							`, [corporate_name, mobile, mobile_2, landline, email, secondary_email, remarks, created_updated_by, parseInt(client_id)], (err, data) => {

								if (err) {

									appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
									appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
									return;
								}

								// Update the corresponding user information
								try {
									appEnv.postgreQryBldr.executeQuery(0, `
										UPDATE users
										SET user_name = $1, mobile = $2, email = $3, password = $4, updated_by = $5
										WHERE id = (SELECT user_id FROM client WHERE id = $6) RETURNING *;
									`, [corporate_name + "_" + mobile, mobile, email, password, created_updated_by, client_id], (err, data) => {

										if (err) {
											appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
											appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
											return;
										}

										// successfully updated
										appEnv.responseGenerator.sendResponse(res, false, 200, null, "", "Client and associated user updated successfully.", null);
										return;
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
				});
			}
			catch (err) {

				appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
				appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
				return;
			}
		}
		catch (err) {

			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
			return;
		}
	}
};




// "use strict";
// module.exports = {
// 	main: function (req, res, appEnv) {

// 		const log_unique_id = require("uuid4")().toString();
// 		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
// 		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

// 		try {
// 			const { client_id = "", corporate_name = "", mobile = "", mobile_2 = null, landline = null, email = "", secondary_email = null, password = "", remarks = "", photo = "" } = req.body;

// 			if (!client_id) {
// 				return res.status(400).send('Client ID is required');
// 			}

// 			appEnv.postgreQryBldr.executeQuery(0, `
// 			UPDATE client
// 			SET corporate_name = $1, mobile = $2, mobile_2 = $3, landline = $4, email = $5, secondary_email = $6, remarks = $7
// 			WHERE id = $8;
// 		`, [corporate_name, mobile, mobile_2, landline, email, secondary_email, remarks, parseInt(client_id)], (err, data) => {
// 				try {
// 					if (err) {

// 						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 						return;
// 					}

// 					appEnv.postgreQryBldr.executeQuery(0, `
// 					UPDATE users
// 					SET user_name = $1, mobile = $2, email = $3, password = $4
// 					WHERE id = (SELECT user_id FROM client WHERE id = $5) RETURNING *;
// 				`, [corporate_name + "_" + mobile, mobile, email, password, client_id], (err, updateData) => {
// 						try {
// 							if (err) {

// 								appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 								appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 								return;
// 							}

// 							appEnv.responseGenerator.sendResponse(res, false, 200, null, "", "Client and associated user updated successfully.", null);
// 							return;
// 						}
// 						catch (err) {

// 							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 							return;
// 						}
// 					});
// 				}
// 				catch (err) {

// 					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 					return;
// 				}
// 			});
// 		}
// 		catch (err) {

// 			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 			return;
// 		}
// 	}
// };