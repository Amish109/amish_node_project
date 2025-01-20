"use strict";

module.exports = {

	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

		try {
			const insurance_company_id = req.params.insurance_company_id;

			appEnv.postgreQryBldr.executeQuery(0, "UPDATE insurance_company SET is_obsolete = $1, updated_by = $3 WHERE id = $2", [2, insurance_company_id, created_updated_by], (err, data) => {
				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));

						console.error('Error updating insurance company status:', err);
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					appEnv.responseGenerator.sendResponse(res, false, 200, null, "", "Insurance company deleted successfully.", null);
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