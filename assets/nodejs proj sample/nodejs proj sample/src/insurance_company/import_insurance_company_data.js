"use strict";

module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

		const CapitalizeName = require("../utilities/name_parser");
		const csv = require('csv-parser');
		const fs = require('fs');

		const filePath = req.file.path;

		const results = [];
		fs.createReadStream(filePath)
			.pipe(csv({ header: true, trim: true, auto_parse: true }))
			.on('data', (data) => {
				if (Object.keys(data).length == 1) {
					let entry = Object.entries(data)[0];
					let headers = entry[0].split('\t');
					let values = entry[1].split('\t');

					let result = {};
					headers.forEach((header, index) => {
						result[header.trim()] = values[index].trim();
					});
					results.push(result);
				}
				else {
					results.push(data);
				}
			})
			.on('end', async () => {
				try {

					for (let itr = 0; itr < results.length; itr++) {

						const name = CapitalizeName(results[itr]["Name"]);
						appEnv.postgreQryBldr.executeQuery(0, `
							INSERT INTO public.insurance_company ( name, description ) VALUES ( $1, $2 ) RETURNING *
						`, [name, results[itr]["Description"]], function (err, result) {

							if (err) {

								appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
								appEnv.responseGenerator.sendResponse(res, true, 500, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
								return;
							}
						});
					}

					appEnv.responseGenerator.sendResponse(res, false, 200, results, 0, null);
					return;
				}
				catch (err) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					console.error('Error importing data:', e);
					appEnv.responseGenerator.sendResponse(res, true, 500, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
					return;
				}
			});
	}
};