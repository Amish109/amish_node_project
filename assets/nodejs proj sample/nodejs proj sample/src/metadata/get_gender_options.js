"use strict";

const { types } = require("util");

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

				const gender_data = parsed_data.GENDER.map(data => ({ value: data }));

				appEnv.responseGenerator.sendResponse(res, false, 200, gender_data, 0, null, null);
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
