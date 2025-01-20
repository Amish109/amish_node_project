"use strict";

module.exports = {

	main: function (req, res, appEnv) {

		try {

			const log_unique_id = require("uuid4")().toString();
			const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
			const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

			const { id = null, name = "", description = "" } = req.body;

			if (!id) {

				appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "ID is required", null);
				return;
			}

			appEnv.postgreQryBldr.executeQuery(0, `UPDATE insurance_company SET name = $1, description = $2, updated_by = $3, updated_at = NOW() WHERE id = $4 RETURNING *;`, [name, description, created_updated_by, parseInt(id)], (err, data) => {

				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					appEnv.responseGenerator.sendResponse(res, false, 200, data, "", "Insurance company updated successfully.", null);
					return;
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