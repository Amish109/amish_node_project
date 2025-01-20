"use strict";

module.exports = {
	main: function (req, res, appEnv) {
		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;
		const cloudinary = require('../../src/base/cdn_connector').cloudinaryConnector(appEnv);

		try {
			let document_id = req.params.document_id;

			if (!document_id) {
				appEnv.responseGenerator.sendResponse(res, true, 400, null, "Document ID is required", "Document ID is missing", null);
				return;
			}

			let { document_no } = req.query;
			let ifsc_code = req.query.ifsc_code || null;
			let misc = {};

			if (ifsc_code) {
				misc.ifsc_code = ifsc_code;
			}

			try {
				const aes_encryption = require(appEnv.appPath + "/src/generic/aes-256-encryption-decryption");

				if (document_no) {
					document_no = aes_encryption.encrypt(appEnv, document_no).cipher;
				}
			} catch (err) {
				appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			}

			if (!req.file && !document_no) {
				appEnv.responseGenerator.sendResponse(res, true, 400, null, "No updates provided", "At least a file or document number is required for update", null);
				return;
			}

			let auxillary_condition = "";

			if (req.file) {
				const { path, mimetype, size, originalname, filename } = req.file;

				cloudinary.uploader.upload(path, { resource_type: "auto", folder: "Hayosha_Doc" }, function (err, result) {

					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					auxillary_condition += ` original_file_name = '${originalname}', `;
					auxillary_condition += ` file_name = '${filename}', `;
					auxillary_condition += ` file_path = '${result.secure_url}', `;
					auxillary_condition += ` file_type = '${mimetype}', `;
					auxillary_condition += ` file_size = ${size}, `;

					if (document_no) {
						auxillary_condition += ` document_no = '${document_no}', `;
					}

					if (misc.ifsc_code) {
						auxillary_condition += ` misc = '${JSON.stringify(misc)}', `;
					}

					auxillary_condition += ` updated_by = '${created_updated_by}', updated_at = NOW() `;

					appEnv.postgreQryBldr.executeQuery(0, `
						UPDATE
							documents SET ${auxillary_condition}
						WHERE
							id = ${document_id}
						RETURNING id, file_name, original_file_name, file_path, file_type, file_size, document_no, misc;`, [], function (err, data) {

						if (err) {

							appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
							appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
							return;
						}

						let response_data = [
							{
								...data[0],
								public_file_url: result.secure_url,
							},
						];

						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "Document updated successfully.", null);
						return;
					}
					);
				});
			}
			else {

				if (document_no) {
					auxillary_condition += ` document_no = '${document_no}', `;
				}

				if (misc.ifsc_code) {
					auxillary_condition += ` misc = '${JSON.stringify(misc)}', `;
				}

				auxillary_condition += ` updated_by = '${created_updated_by}', updated_at = NOW() `;

				appEnv.postgreQryBldr.executeQuery(0, `
					UPDATE
						documents SET ${auxillary_condition}
					WHERE id = ${document_id}
					RETURNING id, file_name, original_file_name, file_path, file_type, file_size, document_no, misc;`, [], function (err, data) {

					if (err) {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
						return;
					}

					let response_data = [
						{
							...data[0],
							public_file_url: data[0].file_path,
						},
					];

					appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "Document updated successfully.", null);
					return;
				}
				);
			}
		}
		catch (err) {

			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
			return;
		}
	},
};
