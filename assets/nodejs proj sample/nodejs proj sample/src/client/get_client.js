"use strict";
module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;

		let client_id = parseInt(req.params.client_id);

		if (!client_id) {
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Required client ID ", null);
			return;
		}
		try {
			appEnv.postgreQryBldr.executeQuery(0, `
			SELECT 
				clnt.id, 
				clnt.corporate_name,
				clnt.client_logo_id,
				clnt.client_code,
				clnt.mobile,
				clnt.mobile_2,
				clnt.landline,
				clnt.email,
				clnt.secondary_email,
				(SELECT COUNT(*) FROM distributor dstr WHERE dstr.client_id = clnt.id AND dstr.is_obsolete = 0) AS distributors_count,
				(SELECT COUNT(*) FROM operator optr WHERE optr.client_id = clnt.id AND optr.is_obsolete = 0) AS operators_count,
				(SELECT docs.file_name FROM documents docs WHERE docs.id = clnt.client_logo_id AND docs.is_obsolete = 0) AS file_name,
				(SELECT docs.file_path FROM documents docs WHERE docs.id = clnt.client_logo_id AND docs.is_obsolete = 0) AS file_path,
				clnt.remarks,
				COALESCE((SELECT ARRAY_AGG(ap.package_id) FROM assign_pkg ap WHERE ap.client_id = clnt.id AND ap.is_obsolete = 0), '{}') AS package_list,
				COALESCE(
				(
					SELECT json_agg(
							json_build_object(
								'package_id', ap.package_id,
								'circle_id', ap.circle_id
							)
					) 
					FROM assign_pkg ap 
					WHERE ap.client_id = clnt.id AND ap.is_obsolete = 0
				), '[]'::json) AS assign_package_list
			FROM
				client clnt
			WHERE
				clnt.id = $1 AND clnt.is_obsolete = 0;`, [client_id], (err, data) => {
				try {
					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));

						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, log_unique_id);
						return;
					}
					else {
						const response_data = {
							"tableHeaders": [
								{
									"displayTitle": "Client ID",
									"subTitle": "ID of the client",
									"associatedDataField": "id",
									"fieldDataType": "number",
								},
								{
									"displayTitle": "Corporate Name",
									"subTitle": "Name of the client",
									"associatedDataField": "corporate_name",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Client Code",
									"subTitle": "Code of the client",
									"associatedDataField": "client_code",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Mobile",
									"subTitle": "Mobile number",
									"associatedDataField": "mobile",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Alternate Mobile",
									"subTitle": "Alternate mobile number",
									"associatedDataField": "mobile_2",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Landline",
									"subTitle": "Landline number",
									"associatedDataField": "landline",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Email",
									"subTitle": "Email address",
									"associatedDataField": "email",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Secondary Email",
									"subTitle": "Secondary email address",
									"associatedDataField": "secondary_email",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "Distributors Count",
									"subTitle": "Number of distributors",
									"associatedDataField": "distributors_count",
									"fieldDataType": "number",
								},
								{
									"displayTitle": "Operators Count",
									"subTitle": "Number of operators",
									"associatedDataField": "operators_count",
									"fieldDataType": "number",
								},
								{
									"displayTitle": "Remarks",
									"subTitle": "Remarks",
									"associatedDataField": "remarks",
									"fieldDataType": "string",
								},
								{
									"displayTitle": "User ID",
									"subTitle": "ID of the user associated with the client",
									"associatedDataField": "user_id",
									"fieldDataType": "number",
								}
							],
							"tableData": data,
							"totalCount": data.length,
						};

						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "Client data fetched successfully.", null);
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