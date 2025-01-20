"use strict";

module.exports = function (app, appEnv) {
	let currPath = "/client";

	const multer = require('multer');
	const upload = multer({ dest: 'uploads/' });

	/* GET URLs */

	// URL: /client/api/v1/get_client/:client_id/
	app.get(currPath + '/api/v1/get_client/:client_id/', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/get_client", req, res, appEnv, 1, 0);
	});

	// URL: /client/api/v1/get_client_list/
	app.get(currPath + '/api/v1/get_client_list/', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/get_client_list", req, res, appEnv, 1, 0);
	});

	/* POST URLs */

	// URL: /client/api/v1/create_client/
	app.post(currPath + '/api/v1/create_client/', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/create_client", req, res, appEnv, 1, 0);
	});

	// URL: /client/api/v1/import_client/
	app.post(currPath + '/api/v1/import_client/', upload.single('file'), function (req, res) {

		appEnv.reqHndlr.execute("/src/client/import_client_data", req, res, appEnv, 1, 0);
	});

	/* PUT URLs */

	// URL: /client/api/v1/update_client/
	app.put(currPath + '/api/v1/update_client/', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/update_client", req, res, appEnv, 1, 0);
	});

	/* DELETE URLs */

	// URL: /client/api/v1/delete_client/
	app.delete(currPath + '/api/v1/delete_client/:client_id', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/delete_client", req, res, appEnv, 1, 0);
	});

	// URL: /client/api/v1/get_client_using_user_id/
	app.get(currPath + '/api/v1/get_client_using_user_id/:user_id', function (req, res) {

		appEnv.reqHndlr.execute("/src/client/get_client_using_user_id", req, res, appEnv, 1, 0);
	});
};