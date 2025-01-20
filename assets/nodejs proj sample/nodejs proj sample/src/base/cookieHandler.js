// @author: Manish Jain
// Created on: 2017-07-12 3:01 PM
// Description: To handle cookies and sessions.

// Modified by: Manish Jain
// On: 2022-01-03 13:00
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

let encryptionKey = "B2018184288CE8B90ACF45B6355C15AA4F92DFC2F1DBBD8CE02E488EB546FB5BBC53EA8B3CABCBCE46139346B5F1AA794253C1911ACD5D11DBB1E5D283841115";

module.exports = {
	// Function to set cookie.
	setCookie: function (responseOBJ, cookieParams, timeInSeconds) {
		try {
			let crypto = require('crypto-js');

			for (let attributename in cookieParams) {
				responseOBJ.cookie(attributename, crypto.AES.encrypt(cookieParams[attributename], encryptionKey).toString(), { "maxAge": timeInSeconds, "httpOnly": true, "secure": true });
			}
		}
		catch (err) {
			console.error(err);
		}
	},

	// Function to get cookie.
	getCookie: function (requestOBJ, cookieKey) {
		try {
			let crypto = require('crypto-js');
			return crypto.AES.decrypt(requestOBJ.cookies[cookieKey], encryptionKey).toString(crypto.enc.Utf8);
		}
		catch (err) {
			return null;
		}
	},

	// Function to delete all cookies.
	clearCookies: function (requestOBJ, responseOBJ) {
		try {
			for (let attributename in requestOBJ.cookies) {
				responseOBJ.cookie(attributename, "", { "maxAge": -3600 });
			}
		}
		catch (err) {
			console.error(err);
		}
	}
};
