"use strict";

module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		try {

			const fs = require("fs");
			const yaml = require("js-yaml");

			fs.readFile(__dirname + "/../../constants/app_global_constants.yaml", "utf8", (err, data) => {

				if (err) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 500, null, 0, err, null);
					return;
				}

				const parsed_data = yaml.load(data);

				const state_data = parsed_data.INDIAN_STATES_LIST.map(status => ({ value: status }));

				appEnv.responseGenerator.sendResponse(res, false, 200, state_data, 0, null, null);
				return;
			});
		}
		catch (err) {

			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			appEnv.responseGenerator.sendResponse(res, true, 500, null, 0, err, null);
			return;
		}
	}
};
