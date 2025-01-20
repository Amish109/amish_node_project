"use strict";
const path = require("path");
const fs = require("fs");

module.exports = {
	main: function (req, res, appEnv) {

		const log_unique_id = require("uuid4")().toString();
		const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
		const aes_encryption = require(appEnv.appPath + "/src/generic/aes-256-encryption-decryption");
		const created_updated_by = appEnv.sessionOBJ.getSessionValue(req, appEnv, "email") || null;


		try {
			let { document_id } = req.params;
			let { file_name } = req.query || "";

			if (!document_id && !file_name) {
				appEnv.responseGenerator.sendResponse(res, true, 400, null, "", "document_id or file_name is required", null);
				return;
			}

			// Execute the query to fetch document details
			appEnv.postgreQryBldr.executeQuery(0, `
				SELECT
					docs.id,
					docs.original_file_name,
					docs.file_name,
					docs.file_type,
					docs.file_path,
					docs.file_size,
					docs.document_no,
					docs.misc
				FROM
					documents docs
				WHERE
					docs.id = $1 OR docs.file_name = $2 AND docs.is_obsolete = 0;`, [document_id, file_name], (err, data) => {

				if (err) {

					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
					return;
				}

				if (data.length > 0) {
					const { file_name: dbFileName, original_file_name: originalFileName, file_type: fileType } = data[0];

					const filePath = path.join(__dirname, '../../uploads', dbFileName);

					if (fs.existsSync(filePath)) {
						const publicFileUrl = `${appEnv.envConfig.APP_BASE_DOMAIN[0]}/uploads/${dbFileName}`;
						const fileExtension = path.extname(dbFileName).toLowerCase();
						let previewUrl;

						// If the file is an Excel file, generate a preview URL using Microsoft Office Viewer
						if (fileExtension == '.xlsx') {
							previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${publicFileUrl}`;
						}
						else {
							// For other files, use the public file URL as the preview URL
							previewUrl = publicFileUrl;
						}

						let decrypted_obj = aes_encryption.decrypt(appEnv, data[0].document_no);

						if (decrypted_obj["status"] == "success") {

							decrypted_obj = decrypted_obj["plain_text"];
						}

						data[0].document_no = decrypted_obj;

						let response_data = [{ ...data[0], preview_url: previewUrl, download_url: publicFileUrl }];

						// Send a response with the preview URL, original file name, and other details
						appEnv.responseGenerator.sendResponse(res, false, 200, response_data, "", "File found", null);
						return;
					}
					else {

						appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
						appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "File not found", null);
						return;
					}
				}
				else {

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







// "use strict";

// module.exports = {
// 	main: function (req, res, appEnv) {
// 		const path = require("path");
// 		const fs = require("fs");

// 		try {
// 			const fileName = req.params.fileName;
// 			const filePath = path.join(__dirname, '../../uploads', fileName);
// 			// console.log(filePath);

// 			if (fs.existsSync(filePath)) {
// 				// Construct query to get the original file name
// 				const query = 'SELECT original_file_name, file_type FROM documents WHERE file_name = $1';
// 				const values = [fileName];

// 				appEnv.postgreQryBldr.executeQuery(0, query, values, (err, data) => {
// 					if (err) {
// 						console.log('Error fetching document details:', err);
// 						appEnv.responseGenerator.sendResponse(res, true, 400, null, "", err, null);
// 						return;
// 					}

// 					if (data.length > 0) {
// 						const originalFileName = data[0].original_file_name;
// 						const publicFileUrl = `${appEnv.envConfig.APP_BASE_DOMAIN[0]}/uploads/${fileName}`;

// 						const fileExtension = path.extname(fileName).toLowerCase();
// 						console.log(fileExtension);
// 						let previewUrl;

// 						if (fileExtension === '.xlsx') {
// 							// Option 1: Google Docs Viewer for Excel file
// 							// previewUrl = `https://docs.google.com/gview?url=${publicFileUrl}&embedded=true`;

// 							// Option 2: Microsoft Office Viewer for Excel file
// 							previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${publicFileUrl}`;
// 						}
// 						else {
// 							previewUrl = publicFileUrl;
// 						}
// 						appEnv.responseGenerator.sendResponse(res, false, 200, { previewUrl, originalFileName , file_extension:fileExtension, downloadUrl:publicFileUrl, fileType: data[0].file_type}, "", "File found", null);
// 					}
// 					else {
// 						appEnv.responseGenerator.sendResponse(res, true, 400, null, "", "File not found in database", null);
// 					}
// 				});
// 			}
// 			else {
// 				appEnv.responseGenerator.sendResponse(res, true, 400, null, "", "File not found", null);
// 			}
// 		}
// 		catch (err) {
// 			console.error(err);
// 			appEnv.responseGenerator.sendResponse(res, true, 400, null, "", err, null);
// 		}
// 	}
// };





// "use strict";

// module.exports = {
// 	main: async (req, res, appEnv) => {
// 		const log_unique_id = require("uuid4")().toString();
// 		try {
// 			const errorHandlerMiscExtractor = require(appEnv.appPath + '/src/utilities/error_handler_misc_extractor.js').errorHandlerMiscExtractor;
// 			// const documentValidator = require(appEnv.appPath + '/src/utilities/document_validator.js').documentValidator;
// 			// const documentNameChecker = require(appEnv.appPath + '/src/utilities/document_name_checker.js').documentNameChecker;

// 			const { document_id } = req.params;

// 			if (!document_id) {
// 				appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "document_id is missing", null);
// 				return;
// 			}

// 			// if (!documentValidator(document_id)) {
// 			// 	appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "document_id is invalid", null);
// 			// 	return;
// 			// }

// 			// if (!documentNameChecker(document_id)) {
// 			// 	appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "document_id is invalid", null);
// 			// 	return;
// 			// }

// 			appEnv.postgreQryBldr.executeQuery(0, `
// 				SELECT * FROM documents WHERE id = $1  is_obsolete = 0;
// 			`, [parseInt(document_id)], (err, data) => {
// 				if (err) {

// 					appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 					return;
// 				}

// 				if (data.length > 0) {
// 					const document = data[0];
// 					// Assuming that the PDF files are stored in a directory like /public/documents/
// 					const pdfPreviewPath = `http://localhost:5521/uploads/${document.file_name}.pdf`;

// 					// Send the response along with the preview path
// 					appEnv.responseGenerator.sendResponse(res, false, 200, { ...document, pdf_preview_path: pdfPreviewPath }, "", null, null);
// 					return;
// 				}
// 				else {

// 					appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Document not found", null);
// 					return;
// 				}

// 				// appEnv.responseGenerator.sendResponse(res, false, 200, data, "", null, null);
// 				// return;
// 			});
// 		}
// 		catch (err) {

// 			appEnv.handleErrorLogs.emailErrorLogs(0, appEnv, 3, err, 1, __filename, req.url, log_unique_id, errorHandlerMiscExtractor(appEnv, req));
// 			appEnv.responseGenerator.sendResponse(res, true, 400, null, JSON.stringify(require('get-current-line').default() || null), err, null);
// 			return;
// 		}
// 	}
// };