"use strict";

module.exports = {

	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		try {
			const user_id = parseInt(req.params.user_id);

			appEnv.postgreQryBldr.executeQuery(0, `
			SELECT clnt.id FROM client clnt WHERE clnt.is_obsolete = 0 AND clnt.user_id = $1;`, [user_id], (err, data) => {
				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					const client = data[0];

					const response_data = {
						"tableHeaders": [
							{
								"displayTitle": "Client ID",
								"subTitle": "ID of the client",
								"associatedDataField": "id",
								"fieldDataType": "number",
							}
						],
						"tableData": [client],
						"totalCount": data.length
					};

					appEnv.responseGenerator.sendResponse(res, false, 200, null, "", null, response_data);
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