// @author: Manish Jain
// Created on: 2023-04-05 14:00
// Description: To Encypt and Decrypt Files.

"use strict";

const CryptoJS = require("crypto-js");

// AES 256 Encryption
let encrypt = function (appEnv, inputString) {

	let return_obj = {};

	try {
		if (typeof inputString != "string") {

			return_obj["status"] = "error";
			return_obj["error"] = "invalid_string_format";
			return_obj["data"] = inputString;
		}
		else {

			return_obj["status"] = "success";
			return_obj["cipher"] = CryptoJS.AES.encrypt(inputString, appEnv.envConfig.AES_256_SECRET_KEY[0]).toString();
		}
		return return_obj;
	}
	catch (err) {

		return_obj["status"] = "error";
		return_obj["error"] = err;
		return_obj["data"] = inputString;
		return return_obj;
	}
};

// AES 256 Decryption
let decrypt = function (appEnv, inputCipher) {

	let return_obj = {};

	try {

		if (typeof inputCipher != "string") {

			return_obj["status"] = "error";
			return_obj["error"] = "invalid_cipher_format";
			return_obj["data"] = inputCipher;
		}
		else {

			return_obj["status"] = "success";
			let plain_text = "";

			// For rotation of keys
			for (let itr1 = 0; itr1 < appEnv.envConfig.AES_256_SECRET_KEY.length; itr1++) {

				try {

					plain_text = CryptoJS.AES.decrypt(inputCipher, appEnv.envConfig.AES_256_SECRET_KEY[itr1]).toString(CryptoJS.enc.Utf8);
					break;
				}
				catch (err) { }
			}

			return_obj["plain_text"] = plain_text;
		}
		return return_obj;
	}
	catch (err) {

		return_obj["status"] = "error";
		return_obj["error"] = err;
		return_obj["data"] = inputCipher;
		return return_obj;
	}
};

module.exports = {
	encrypt: encrypt,
	decrypt: decrypt
};