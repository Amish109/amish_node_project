// @author: Manish Jain
// Created on: 2024-09-25 11:00
// Description: Generate UUID function.

"use strict";

let getTxnId = function (length = null) {

	const { v7: uuidv7 } = require('uuid');
	let generated_uuid = uuidv7();
	// let generated_uuid = uuidv7({ msecs: new Date().getTime() });

	let transaction_id = generated_uuid.replaceAll("-", "");

	try {

		if (length != null) {

			return transaction_id.substring(transaction_id.length - length, transaction_id.length);
		}
		return transaction_id;
	}
	catch (e) {

		return transaction_id;
	}
};

let getUuid = function () {

	const { v7: uuidv7 } = require('uuid');
	let generated_uuid = uuidv7();

	return generated_uuid;
};

module.exports = {

	getTxnId: getTxnId,
	getUuid: getUuid
};