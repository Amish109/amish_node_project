// @author: Manish Jain
// Created on: 2021-04-28 02:01 PM
// Description: Send email log errors to email groups/devops.

// Modified by: Manish Jain
// On: 2022-01-03 13:30
// Reason: Migrating from ECMA5 to ECMA6.

// Modified by: Manish Jain
// On: 2022-12-20 11:00
// Reason: Store email error logs in Mongo collection "error_logs_data" and trigger only 1 email of same error in 1 day.

"use strict";

// const error_types = [
// 	{
// 		"text": "MSSQL Database error!" // 0
// 	},
// 	{
// 		"text": "PostgreSQL Database error!" // 1
// 	},
// 	{
// 		"text": "MongoDB Database error!" // 2
// 	},
// 	{
// 		"text": "API level error!" // 3
// 	},
// 	{
// 		"text": "Background Job error!" // 4
// 	},
// 	{
// 		"text": "Background Job warning!" // 5
// 	},
// 	{
// 		"text": "Intimation Email!" // 6
// 	}
// ]

// const severity_types = [
// 	"Critical",
// 	"Moderate",
// 	"Low",
// 	"Warning",
// 	"Intimation"
// ];

const forceEmailErrorLogs = function (instanceIndex, appEnv, errorType, errorLog, severity, filePath, urlPath, logUUID, misc = null) {
	let email_content = {};
	email_content["email_title"] = "Error logging failed";
	email_content["severity"] = "Moderate";
	email_content["file_path"] = filePath;
	email_content["url_path"] = urlPath;
	email_content["log_uuid"] = logUUID;

	const sha256 = require("crypto-js/sha256");

	if (typeof (misc) == "object") {
		email_content["misc"] = JSON.stringify(misc);
	}
	else {
		email_content["misc"] = (misc + '');
	}

	let error_stack = ((errorLog != null && errorLog.hasOwnProperty('stack')) ? errorLog.stack : errorLog);
	error_stack = (error_stack != null ? error_stack : "");
	email_content["error_log"] = error_stack;

	// let alert_emails = ["mj2code@gmail.com"];
	let alert_emails = appEnv.envConfig.ALERT_EMAILS[2];

	if (appEnv.appEnvName != "dev") {

		appEnv.rollbar.error(error_stack.toString());
	}

	if (appEnv.envConfig.hasOwnProperty("ENABLE_ERR_EMAILS") && appEnv.envConfig.ENABLE_ERR_EMAILS == 1) {

		appEnv.sendSMTPEmail.sendEmail(instanceIndex, alert_emails, ('HYS API Server Error!(' + appEnv.appEnvName + ') #' + sha256(error_stack.toString())), 'error_report_template', email_content, [], function (err) {
			//console.error(err)
		});
	}
	else {

		console.error("@@", new Date(Date.now()), filePath, error_stack.toString());
	}
	return;
};

module.exports = {
	forceEmailErrorLogs: forceEmailErrorLogs,
	emailErrorLogs: function (instanceIndex, appEnv, errorType, errorLog, severity, filePath, urlPath, logUUID, misc = null) {

		let Client = require('node-rest-client').Client;

		let client = new Client();

		const generateServiceRequestToken = require(appEnv.appPath + '/src/generic/generate_service_request_token_v1').generateServiceRequestToken;

		let appkey = appEnv.envConfig.APP_KEY[0];

		const requestBody = {
			"errorType": errorType,
			"errorLog": (typeof (errorLog) == "object") ? ((errorLog != null && errorLog.hasOwnProperty('stack')) ? errorLog.stack : errorLog) : errorLog.toString(),
			"severity": severity,
			"filePath": filePath,
			"urlPath": urlPath,
			"logUUID": logUUID,
			"misc": (typeof (misc) == "object") ? JSON.stringify(misc) : misc
		};

		// set content-type header and data as json in args parameter
		let args = {
			data: requestBody,
			headers: { "Content-Type": "application/json", "AppKey": appkey, "requestsignature": generateServiceRequestToken(appEnv, 0, {}, requestBody) }
		};

		// client.post(appEnv.envConfig.REPORTING_SERVICE_DOMAIN[0] + "/services/v1/log/error/backend/", args, function (raw_data, raw_response) {
		// 	if (raw_response.statusCode != 200) {
		forceEmailErrorLogs(instanceIndex, appEnv, errorType, errorLog, severity, filePath, urlPath, logUUID, misc);
		// 		return;
		// 	}
		// 	else {
		// 		return;
		// 	}
		// });
	}
};