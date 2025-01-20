//@Author : Manish Jain
//Modified on : 2018-06-12 12:09 PM
//Reason : Generate Api response.

// Modified by: Manish Jain
// On: 2022-01-03 15:00
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

let sendResponse = function (responseObject, errorStatus, responseCode, responseData, errorCode, errorMessage, logUUID = "") {
	try {
		responseCode = parseInt(responseCode);
		let response_object = {};

		if (errorStatus == false && responseCode >= 200 && responseCode < 300) {
			responseObject.status(responseCode);
			response_object["status"] = "success";
			response_object["data"] = responseData;
			response_object["error"] = null;
			response_object["errorCode"] = 0;
			response_object["logUUID"] = logUUID;
		}
		else {
			responseObject.status(responseCode);
			response_object["status"] = "error";
			response_object["data"] = responseData;
			response_object["error"] = errorMessage;
			response_object["errorCode"] = errorCode;
			response_object["logUUID"] = logUUID;
		}

		if (responseObject.hasOwnProperty("resWarnings")) {
			response_object["warnings"] = responseObject.resWarnings;
		}

		if (!responseObject.headersSent) {
			responseObject.send(response_object);
		}
	}
	catch (err) {
		console.error(err);
		let returnStatus = {
			"status": "error",
			"description": "Oops! Something went wrong while processing your request."
		};

		if (!responseObject.headersSent) {
			responseObject.status(500);
			responseObject.send(returnStatus);
		}
		return;
	}
};

let sendResponseWithCache = function (appEnv, requestObject, responseObject, errorStatus, responseCode, responseData, errorCode, errorMessage, logUUID = "") {
	try {
		responseCode = parseInt(responseCode);
		let response_object = {};

		if (errorStatus == false && responseCode >= 200 && responseCode < 300) {
			responseObject.status(responseCode);
			response_object["status"] = "success";
			response_object["data"] = responseData;
			response_object["error"] = null;
			response_object["errorCode"] = 0;
			response_object["logUUID"] = logUUID;

			const crypto_sh256 = require("crypto-js/sha256");

			let orderedQueryParams = {};
			Object.keys(requestObject.query).sort().forEach(function (key) {
				orderedQueryParams[key] = requestObject.query[key];
			});

			let cache_handler = require(appEnv.appPath + '/src/base/cacheHandler');
			cache_handler.saveToCache((0 >= 0 ? 0 : 0), appEnv, appEnv.sessionOBJ.getSessionValue(requestObject, appEnv, "organization_id"), crypto_sh256(requestObject.protocol + '://' + requestObject.get('host') + requestObject.path + JSON.stringify(orderedQueryParams) + appEnv.sessionOBJ.getSessionValue(requestObject, appEnv, "organization_id")).toString(), responseData);

			if (!responseObject.headersSent) {
				responseObject.send(response_object);
			}
		}
		else {
			if (!responseObject.headersSent) {
				responseObject.status(responseCode);
				response_object["status"] = "error";
				response_object["data"] = responseData;
				response_object["error"] = errorMessage;
				response_object["errorCode"] = errorCode;
				responseObject.send(response_object);
				response_object["logUUID"] = logUUID;
			}
		}
	}
	catch (err) {
		console.error(err);
		let returnStatus = {
			"status": "error",
			"description": "Oops! Something went wrong while processing your request."
		};
		if (!responseObject.headersSent) {
			responseObject.status(500);
			responseObject.send(returnStatus);
		}
		return;
	}
};

module.exports = {
	sendResponse: sendResponse,
	sendResponseWithCache: sendResponseWithCache
};
