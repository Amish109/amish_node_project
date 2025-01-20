"use strict";

module.exports = {

	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		try {

			let search_text = (req.query.hasOwnProperty("search_text") && req.query["search_text"] != "") ? req.query["search_text"] : null;
			let sort_by = (req.query.hasOwnProperty("sort_by") && req.query["sort_by"] != "") ? req.query["sort_by"] : "corporate_name";
			let sorting_order = (req.query.hasOwnProperty("sort_order") && req.query["sort_order"] != "") ? req.query["sort_order"] : null;
			let auxillary_condition = "";

			// Dynamic search condition to search across all columns (only work for string fields)
			// if (![null, undefined, "", "null", "undefined"].includes(search_text)) {
			// 	let searchableColumns = ["corporate_name", "mobile", "mobile_2", "landline", "email", "secondary_email", "remarks"];
			// 	let search_conditions = searchableColumns.map(column => ` ${column} ILIKE '%${search_text}%'`).join(' OR ');
			// 	auxillary_condition += ` AND (${search_conditions})`;
			// }

			// Dynamic search condition to search across all columns (work for string and numeric fields)
			if (![null, undefined, "", "null", "undefined"].includes(search_text)) {

				let text_columns = ["clnt.corporate_name", "clnt.mobile", "clnt.mobile_2", "clnt.landline", "clnt.email", "clnt.secondary_email", "clnt.remarks"];
				let numeric_columns = [];

				const search_is_number = !isNaN(search_text);

				let search_conditions = [];

				search_conditions.push(
					...text_columns.map(column => ` ${column} ILIKE '%${search_text}%'`)
				);

				if (search_is_number) {
					search_conditions.push(
						...numeric_columns.map(column => ` ${column} = ${search_text}`)
					);
				}

				auxillary_condition += ` AND (${search_conditions.join(' OR ')})`;
			}

			let sort_order_final = {};

			if (req.query.hasOwnProperty('sort_by')) {
				try {
					let sorting_order_value = sorting_order && ["desc", "DESC", "descend"].includes(sorting_order) ? -1 : 1;
					sort_order_final["order"] = sorting_order_value;

					switch (sort_by) {
						case "id":
							sort_order_final["field"] = "id";
							break;
						case "corporate_name":
							sort_order_final["field"] = "corporate_name";
							break;
						case "distributors_count":
							sort_order_final["field"] = "distributors_count";
							break;
						case "mobile":
							sort_order_final["field"] = "mobile";
							break;
						case "operators_count":
							sort_order_final["field"] = "operators_count";
							break;
						case "email":
							sort_order_final["field"] = "email";
							break;
						default:
							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Invalid sort parameter.");
							return;
					}
				}
				catch (err) {

					appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)), appEnv, 3, err, 1, __filename, req.path, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Invalid or missing request parameters.", log_unique_id);
					return;
				}
			}
			else {
				sort_order_final["field"] = "id";
				sort_order_final["order"] = 1; // Default to ascending
			}

			appEnv.postgreQryBldr.executeQuery(0, `
            SELECT 
                clnt.id,
                clnt.corporate_name,
				clnt.client_logo_id,
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
				COALESCE((SELECT ARRAY_AGG(DISTINCT ap.package_id) FROM assign_pkg ap WHERE ap.client_id = clnt.id AND ap.is_obsolete = 0), '{}') AS package_list,
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
                clnt.is_obsolete = 0 ` + auxillary_condition + `;`, [], (err, data) => {
				try {

					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Error while fetching client data", null);
						return;
					}

					let final_data = data;

					if (final_data.length > 0 && typeof final_data[0][sort_order_final["field"]] == "string") {

						final_data = final_data.sort(function (a, b) { return (a[sort_order_final["field"]].toLowerCase() > b[sort_order_final["field"]].toLowerCase()) ? 1 : ((b[sort_order_final["field"]].toLowerCase() > a[sort_order_final["field"]].toLowerCase()) ? -1 : 0); });
					}
					else {

						final_data = final_data.sort(function (a, b) { return (a[sort_order_final["field"]] > b[sort_order_final["field"]]) ? 1 : ((b[sort_order_final["field"]] > a[sort_order_final["field"]]) ? -1 : 0); });
					}

					if (sort_order_final["order"] == -1) {

						final_data = final_data.reverse();
					}

					let skip_records = 0;
					let limit_records = -1;

					if (req.query.hasOwnProperty("page_index") && req.query.hasOwnProperty("page_size")) {

						try {

							skip_records = Math.abs((parseInt(req.query.page_index) - 1) * parseInt(req.query.page_size));
							limit_records = Math.abs(parseInt(req.query.page_size));
						}
						catch (err) {

							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Error parsing page_index and page_size", null);
							return;
						}
					}

					let paginatedData = final_data.slice(skip_records, skip_records + limit_records);

					let response_data = {
						tableHeaders: [
							// {
							// 	"displayTitle": "Client ID",
							// 	"subTitle": "ID of the client",
							// 	"associatedDataField": "id",
							// 	"fieldDataType": "number",
							// 	"isSortAllowed": true,
							// 	"isDefaultSort": false,
							// 	"sortKey": "id",
							// },
							{
								"displayTitle": "Corporate Name",
								"subTitle": "Name of the client",
								"associatedDataField": "corporate_name",
								"fieldDataType": "string",
								"isSortAllowed": true,
								"isDefaultSort": true,
								"sortKey": "corporate_name",
							},
							{
								"displayTitle": "Distributors Count",
								"subTitle": "Number of distributors",
								"associatedDataField": "distributors_count",
								"fieldDataType": "number",
								"isSortAllowed": true,
								"isDefaultSort": false,
								"sortKey": "distributors_count",
							},
							{
								"displayTitle": "Operators Count",
								"subTitle": "Number of operators",
								"associatedDataField": "operators_count",
								"fieldDataType": "number",
								"isSortAllowed": true,
								"isDefaultSort": false,
								"sortKey": "operators_count",
							},
							{
								"displayTitle": "Mobile",
								"subTitle": "Mobile number",
								"associatedDataField": "mobile",
								"fieldDataType": "string",
								"isSortAllowed": true,
								"isDefaultSort": false,
								"sortKey": "mobile",
							},
							{
								"displayTitle": "Alternate Mobile",
								"subTitle": "Alternate mobile number",
								"associatedDataField": "mobile_2",
								"fieldDataType": "string",
								"isSortAllowed": false,
								"isDefaultSort": false,
								"sortKey": "mobile_2",
							},
							{
								"displayTitle": "Landline",
								"subTitle": "Landline number",
								"associatedDataField": "landline",
								"fieldDataType": "string",
								"isSortAllowed": false,
								"isDefaultSort": false,
								"sortKey": "landline",
							},
							{
								"displayTitle": "Email",
								"subTitle": "Email address",
								"associatedDataField": "email",
								"fieldDataType": "string",
								"isSortAllowed": true,
								"isDefaultSort": false,
								"sortKey": "email",
							},
							// {
							// 	"displayTitle": "Secondary Email",
							// 	"subTitle": "Secondary email address",
							// 	"associatedDataField": "secondary_email",
							// 	"fieldDataType": "string",
							// },
							// {
							// 	"displayTitle": "Assigned Packages",
							// 	"subTitle": "List of assigned packages",
							// 	"associatedDataField": "assigned_packages",
							// 	"fieldDataType": "array",
							// },
							{
								"displayTitle": "Remarks",
								"subTitle": "Remarks",
								"associatedDataField": "remarks",
								"fieldDataType": "string",
								"isSortAllowed": false,
								"isDefaultSort": false,
								"sortKey": "remarks",
							}
						],
						tableData: paginatedData,
						totalCount: final_data.length,
					};

					// Filter table headers if column_name is provided and not "all" or empty
					if (req.query.column_name && req.query.column_name !== "all" && req.query.column_name !== "") {
						let columnNames = Array.isArray(req.query.column_name) ? req.query.column_name : [req.query.column_name];

						// Filter table headers based on column names
						response_data.tableHeaders = response_data.tableHeaders.filter(header => columnNames.includes(header.associatedDataField));
					}

					// Check if export to Excel is requested
					if (req.query.hasOwnProperty("export_to") && req.query.export_to == "excel") {

						let view_online = false;
						if (req.query.hasOwnProperty("export_viewer") && ["ms_excel_online"].includes(req.query.export_viewer)) {
							view_online = true;
						}
						// Prepare data for Excel export
						let final_export_object = [{
							"metadata": { "bookName": 'insurance_company_data', "freezeNumberOfTopRows": 1 },
							"workbookData": []
						}];

						// Add header row
						final_export_object[0].workbookData.push({
							"style": {
								"font": { "bold": true, "color": "#ffffff" },
								"alignment": { "horizontal": "center", "wrapText": true, "vertical": "center", "indent": 1 },
								"fill": { "type": "pattern", "patternType": "solid", "bgColor": "#4b4b7b", "fgColor": "#4b4b7b" }
							},
							"rowData": response_data.tableHeaders.map(header => ({ "value": header.displayTitle, "style": {} }))
						});

						// Add actual data rows to the export object
						final_data.forEach(row => {
							let rowData = response_data.tableHeaders.map(header => ({ "value": row[header.associatedDataField], "style": {} }));
							final_export_object[0].workbookData.push({ "style": {}, "rowData": rowData });
						});

						// Export to Excel
						let export_to_excel = require('../utilities/export_to_excel_v1');
						export_to_excel.exportToExcel(appEnv, final_export_object, res, req, view_online);
						return;
					}
					else {

						// if (req.query.hasOwnProperty("column_name")) {
						// 	response_data.tableHeaders.unshift({
						// 		"displayTitle": "Client ID",
						// 		"subTitle": "ID of the client",
						// 		"associatedDataField": "id",
						// 		"fieldDataType": "number",
						// 		"isSortAllowed": true,
						// 		"isDefaultSort": false,
						// 		"sortKey": "id",
						// 	});
						// }
						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "get client list successfully", null);
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