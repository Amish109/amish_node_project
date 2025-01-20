// @author: Manish Jain
// Created on: 2018-04-027 03:09 AM
// Description: Functions to get prowser fingerprint.

// Modified by: Manish Jain
// On: 2022-01-18 13:30
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2021-12-24 17:20
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

let getBrowserFingerPrint = function (requestOBJ) {
	let text = "";

	const crypto_sha256 = require("crypto-js/sha256");
	const uaParser = require('ua-parser-js');

	let uaparser = new uaParser();
	text = uaparser.setUA(requestOBJ.headers['user-agent']).getOS().name + uaparser.setUA(requestOBJ.headers['user-agent']).getBrowser().name + uaparser.setUA(requestOBJ.headers['user-agent']).getDevice().model + uaparser.setUA(requestOBJ.headers['user-agent']).getDevice().type + requestOBJ.headers['accept-language'] + requestOBJ.headers['accept-encoding'];
	text = crypto_sha256(text).toString();

	return text;
};

module.exports = {
	getBrowserFingerPrint: getBrowserFingerPrint
};