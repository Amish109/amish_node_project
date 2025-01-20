// @author: Manish Jain
// Created on: 2023-01-13 12:03 PM
// Description: To handle request validation.
"use strict";

const PATHS_TO_VALIDATE = [
	"/guide/",
	"/tutorial/",
	"/tooltip/",
	"/workflow/",
	"/page/",
	"/sentiments/",
	"/user/"
];

const validateRequest = function (appEnv, requestObj, callBack) {
	const log_unique_id = require("uuid4")().toString();
	const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;

	let is_validation_required = false;

	for (let itz0 = 0; itz0 < PATHS_TO_VALIDATE.length; itz0++) {
		if (requestObj.path.indexOf(PATHS_TO_VALIDATE[itz0]) == 0) {
			is_validation_required = true;
			break;
		}
	}

	if (is_validation_required == false) {
		callBack(true);
		return;
	}

	const org_id = parseInt(appEnv.sessionOBJ.getSessionValue(requestObj, appEnv, "organization_id"));

	let app_codes = [];
	let app_ids = [];

	if (requestObj.query.hasOwnProperty('app_code')) {
		if (requestObj.queryPolluted.hasOwnProperty('app_code')) {
			for (let itx1 = 0; itx1 < requestObj.queryPolluted.app_code.length; itx1++) {
				if (!app_codes.includes(requestObj.queryPolluted.app_code[itx1])) {
					app_codes.push(requestObj.queryPolluted.app_code[itx1]);
				}
			}
		}
		else {
			app_codes = [requestObj.sanitize(requestObj.query.app_code)];
		}
	}
	else if (requestObj.query.hasOwnProperty('app_id')) {
		if (requestObj.queryPolluted.hasOwnProperty('app_id')) {
			for (let itx1 = 0; itx1 < requestObj.queryPolluted.app_id.length; itx1++) {
				if (!app_ids.includes(requestObj.queryPolluted.app_id[itx1])) {
					app_ids.push(requestObj.queryPolluted.app_id[itx1]);
				}
			}
		}
		else {
			app_ids = [requestObj.sanitize(requestObj.query.app_id)];
		}
	}

	let guide_ids = [];

	// handle various fields name

	// For guides
	if (requestObj.query.hasOwnProperty('guide_id')) {
		if (requestObj.queryPolluted.hasOwnProperty('guide_id')) {
			for (let itx1 = 0; itx1 < requestObj.queryPolluted.guide_id.length; itx1++) {
				if (!guide_ids.includes(requestObj.queryPolluted.guide_id[itx1]) && requestObj.queryPolluted.guide_id[itx1].length > 0) {
					guide_ids.push(requestObj.queryPolluted.guide_id[itx1]);
				}
			}
		}
		else {
			if (requestObj.query.guide_id.length > 0) {
				guide_ids = [requestObj.sanitize(requestObj.query.guide_id)];
			}
		}
	}

	// For tutorials
	if (requestObj.query.hasOwnProperty('tutorial_id')) {
		if (requestObj.queryPolluted.hasOwnProperty('tutorial_id')) {
			for (let itx1 = 0; itx1 < requestObj.queryPolluted.tutorial_id.length; itx1++) {
				if (!guide_ids.includes(requestObj.queryPolluted.tutorial_id[itx1]) && requestObj.queryPolluted.tutorial_id[itx1].length > 0) {
					guide_ids.push(requestObj.queryPolluted.tutorial_id[itx1]);
				}
			}
		}
		else {
			if (requestObj.query.tutorial_id.length > 0) {
				guide_ids = [requestObj.sanitize(requestObj.query.tutorial_id)];
			}
		}
	}

	if (guide_ids.length > 0 && (app_codes.length > 1 || app_ids.length > 1)) {
		callBack(false);
		return;
	}

	let validation_query = "SELECT";

	validation_query += " COUNT(DISTINCT apps.external_id) as 'validated_apps_count'" + (guide_ids.length > 0 ? ", COUNT(DISTINCT tours.tour_id) as 'guides_counts'" : "");

	validation_query += " FROM dbo.tbl_gss_application apps" + (guide_ids.length > 0 ? ", dbo.tbl_gss_tour tours" : "");

	validation_query += " WHERE apps.organization_id = ?";

	if (app_codes.length > 0) {
		validation_query += " AND CONVERT(NVARCHAR(36), apps.external_id) IN ('" + app_codes.join('\',\'') + "')";
	}

	if (app_ids.length > 0) {
		validation_query += " AND apps.application_id IN (" + app_ids.join(',') + ")";
	}

	if (guide_ids.length > 0) {
		validation_query += " AND apps.application_id = tours.application_id AND tours.tour_id IN ('" + guide_ids.join('\',\'') + "')";
	}

	callBack(true);
	return;

	// appEnv.mssqlQryBldr.executeQuery(appEnv.envConfig.APP_KEY.indexOf(requestObj.sanitize(requestObj.headers.appkey)), validation_query, [org_id], function (err, dbResponse1) {
	// 	try {
	// 		if (err) {

	// 			appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(requestObj.sanitize(requestObj.headers.appkey)), appEnv, 1, err, 0, __filename, requestObj.path, log_unique_id, errorHandlerMiscExtractor(appEnv, requestObj));
	// 			callBack(true);
	// 			return;
	// 		}
	// 		else if (dbResponse1.recordset.length == 0) {
	// 			callBack(false);
	// 			return;
	// 		}
	// 		else if (!dbResponse1.recordset[0].hasOwnProperty('guides_counts') && dbResponse1.recordset[0].validated_apps_count >= 1) {
	// 			callBack(true);
	// 			return;
	// 		}
	// 		else if (dbResponse1.recordset[0].guides_counts == guide_ids.length && dbResponse1.recordset[0].validated_apps_count == 1) {
	// 			callBack(true);
	// 			return;
	// 		}
	// 		else if (guide_ids.length == 0 && ((dbResponse1.recordset[0].validated_apps_count == app_codes.length && app_codes.length > 0) || (dbResponse1.recordset[0].validated_apps_count == app_ids.length && app_ids.length > 0))) {
	// 			callBack(true);
	// 			return;
	// 		}
	// 		else {
	// 			callBack(false);
	// 			return;
	// 		}
	// 	}
	// 	catch (err) {

	// 		appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(requestObj.sanitize(requestObj.headers.appkey)), appEnv, 1, err, 0, __filename, requestObj.path, log_unique_id, errorHandlerMiscExtractor(appEnv, requestObj));
	// 		callBack(false);
	// 		return;
	// 	}
	// });
};

module.exports = {
	validateRequest: validateRequest
};