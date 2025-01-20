"use strict";

module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		// const cloudinary = require('cloudinary').v2;
		const cloudinary = require('../../src/base/cdn_connector').cloudinaryConnector(appEnv);
		try {

			if (!req.file) {

				appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Please upload a file", null);
				return;
			}

			const { path, mimetype, size, originalname, filename } = req.file;

			let document_no = req.query.document_no || "";

			try {

				const aes_encryption = require(appEnv.appPath + "/src/generic/aes-256-encryption-decryption");

				if (![null, undefined, "", "null", "undefined"].includes(document_no)) {

					document_no = aes_encryption.encrypt(appEnv, document_no)["cipher"];
				}
			}
			catch (err) {

				appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			}

			let ifsc_code = req.query.hasOwnProperty('ifsc_code') ? req.query.ifsc_code : null;

			let misc = {};

			if (![null, undefined, "", "null", "undefined"].includes(ifsc_code)) {
				misc.ifsc_code = ifsc_code;
			}

			cloudinary.uploader.upload(path, { resource_type: "auto", folder: "Hayosha_Doc" }, function (error, result) {

				if (error) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, error, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), error, null);
					return;
				}

				appEnv.postgreQryBldr.executeQuery(0, `
					INSERT INTO documents (original_file_name, file_name, file_path, file_type, file_size, document_no, misc, created_by)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, original_file_name, file_name, file_path, file_type, file_size, document_no, misc;
				`, [originalname, filename, result.secure_url, mimetype, size, document_no, JSON.stringify({}), created_updated_by], (err, data) => {
					try {
						if (err) {

							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
							return;
						}

						let response_data = [{ ...data[0], public_file_url: result.secure_url }];

						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "Document created successfully.", null);
						return;
					}
					catch (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}
				});
			});
		}
		catch (err) {

			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
			return;
		}
	}
};