"use strict";

module.exports = function (app, appEnv) {
	let currPath = "/document";

	const multer = require('multer');
	const path = require('path');
	const storage = multer.diskStorage({
		destination: 'uploads',

		filename: (req, file, cb) => {
			return cb(null, `${file.fieldname}_${Date.now()}_${require('crypto').randomInt(100001, 999999)}${path.extname(file.originalname)}`);
		}
	});

	const upload = multer({
		storage: storage
	});

	/* GET URLs */

	// URL: /document/api/v1/get_document/:document_id/
	app.get(currPath + '/api/v1/get_document/:document_id', function (req, res) {

		appEnv.reqHndlr.execute("/src/document/get_document", req, res, appEnv, 1, 0);
	});

	// URL: /document/api/v1/get_document_list/
	app.get(currPath + '/api/v1/get_document_list/', function (req, res) {

		appEnv.reqHndlr.execute("/src/document/get_document_list", req, res, appEnv, 1, 0);
	});

	/* POST URLs */

	// URL: /document/api/v1/create_document/
	app.post(currPath + '/api/v1/create_document/', upload.single('file'), function (req, res) {

		appEnv.reqHndlr.execute("/src/document/create_document", req, res, appEnv, 1, 0);
	});

	// URL: /document/api/v1/import_document/
	app.post(currPath + '/api/v1/import_document/', upload.single('file'), function (req, res) {

		appEnv.reqHndlr.execute("/src/document/import_document_data", req, res, appEnv, 1, 0);
	});

	/* PUT URLs */

	// URL: /document/api/v1/update_document/
	app.put(currPath + '/api/v1/update_document/:document_id', upload.single('file'), function (req, res) {

		appEnv.reqHndlr.execute("/src/document/update_document", req, res, appEnv, 1, 0);
	});

	/* DELETE URLs */

	// URL: /document/api/v1/delete_document/
	app.delete(currPath + '/api/v1/delete_document/:document_id', function (req, res) {

		appEnv.reqHndlr.execute("/src/document/delete_document", req, res, appEnv, 1, 0);
	});

	// URL: /document/api/v1/get_document_using_user_id/
	app.get(currPath + '/api/v1/get_document_using_user_id/:user_id', function (req, res) {

		appEnv.reqHndlr.execute("/src/document/get_document_using_user_id", req, res, appEnv, 1, 0);
	});
};