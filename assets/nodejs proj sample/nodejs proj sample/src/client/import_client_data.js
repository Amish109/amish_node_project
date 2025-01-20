"use strict";
const CapitalizeName = require("../utilities/name_parser");
module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

		const csv = require('csv-parser');
		const fs = require('fs');

		const filePath = req.file.path;

		const results = [];
		fs.createReadStream(filePath)
			.pipe(csv({ header: true, trim: true }))
			.on('data', (data) => {

				if (Object.keys(data).length == 1) {
					// Manually split the first key and value
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

						// Sending data to the REST API
						let args = {
							data: {
								corporate_name: CapitalizeName(results[itr]["Corporate Name"]),
								mobile: results[itr]["Mobile"],
								mobile_2: results[itr]["Alternate Mobile"],
								landline: results[itr]["Landline"],
								email: results[itr]["Email"],
								secondary_email: results[itr]["Secondary Email"],
								remarks: results[itr]["Remarks"],
								client_code: results[itr]["Client Code"]
							},
							headers: { 'Content-Type': 'application/json', 'AccessToken': req.headers.accesstoken }
						};

						const Client = require('node-rest-client').Client;
						const node_client = new Client();

						await node_client.post(appEnv.envConfig.APP_BASE_DOMAIN[0] + '/client/api/v1/create_client/', args, function (raw_data, raw_response) {
							try {

								appEnv.responseGenerator.sendResponse(res, false, 200, raw_data, 0, null);
								return;
							}
							catch (err) {

								appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
								appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
							}
						});
					}

					// appEnv.responseGenerator.sendResponse(res, false, 200, results, 0, null);
					return;
				}
				catch (err) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 500, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
					return;
				}
			});
	}
};