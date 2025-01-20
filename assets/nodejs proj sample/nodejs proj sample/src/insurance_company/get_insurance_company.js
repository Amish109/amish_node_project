"use strict";

module.exports = {

	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		let insurance_company_id = parseInt(req.params.insurance_company_id);

		try {
			appEnv.postgreQryBldr.executeQuery(0, "SELECT ic.id, ic.name, ic.description FROM insurance_company ic WHERE ic.is_obsolete = 0 AND ic.id = $1;", [insurance_company_id], (err, data) => {
				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Error while fetching insurance company data", null);
						return;
					}
					else {
						let response_data = {
							"tableHeaders": [
								{
									"displayTitle": "Insurance Company ID",
									"subTitle": "ID of the insurance company",
									"associatedDataField": "id",
									"fieldDataType": "number",
								},
								{
									"displayTitle": "Name",
									"subTitle": "Name of the insurance company",
									"associatedDataField": "name",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Description",
									"subTitle": "Description of the insurance company",
									"associatedDataField": "description",
									"fieldDataType": "string",
								}
							],
							"tableData": data,
							"totalCount": data.length,
						};

						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "Insurance company fetched successfully.", null);
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
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
			return;
		}
	}
};