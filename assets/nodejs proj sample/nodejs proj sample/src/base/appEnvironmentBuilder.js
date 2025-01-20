// @author: Manish Jain
// Created on: 2020-03-17 04:25 PM
// Description: App Environment Builder.

// Modified by: Manish Jain
// On: 2022-01-17 11:30
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2022-05-03 12:30
// Reason: Migrating from ECMA5 to ECMA6.

// Modified by: Manish Jain
// On: 2022-11-02 12:30
// Reason: Adding support for loading via env variables.
"use strict";

let getAppEnvironment = function (applicationRootDirectory, servicesGroup = "default") {
	// Create simple environment Object.
	let appEnv = { "appPath": applicationRootDirectory };

	// Initialize App environment
	let app_start_params = {};

	try {
		if (process.env.hasOwnProperty("APP_ENVIRONMENT_NAME")) {
			app_start_params = {
				"APP_ENVIRONMENT_NAME": process.env.APP_ENVIRONMENT_NAME
			};
		}
		else {
			const fs = require('fs');
			const YAML = require('yaml');

			const app_start_params_file = fs.readFileSync('./server_config/app_start_params.yaml', 'utf8');
			app_start_params = YAML.parse(app_start_params_file);
		}
	}
	catch (e) {
		// Default to Dev env, if no config found.
		app_start_params = {
			"APP_ENVIRONMENT_NAME": "dev"
		};
	}

	// Initialize App Environment.
	appEnv.appEnvName = app_start_params.APP_ENVIRONMENT_NAME;

	const YAML = require('yaml');
	const fs = require('fs');

	try {
		const env_config_file = fs.readFileSync(appEnv.appPath + '/appconfig/' + appEnv.appEnvName + '/env_config.yaml', 'utf8');
		appEnv.envConfig = YAML.parse(env_config_file);
	}
	catch (e) {
		console.error(e);
		throw "Invalid env config values";
	}

	// Populating constants.
	appEnv.constants = YAML.parse(fs.readFileSync(appEnv.appPath + '/constants/app_global_constants.yaml', 'utf8'));

	// Initializing payment config.
	appEnv.paymentConfig = YAML.parse(fs.readFileSync(appEnv.appPath + '/server_config/payment_config.yaml', 'utf8'));

	// Populate client category list.
	appEnv.envConfig.CLIENT_CATEGORY_LIST = [];

	for (let category_item in appEnv.envConfig.APP_NAME_MAPPING) {
		appEnv.envConfig.CLIENT_CATEGORY_LIST.push(category_item);
	}

	appEnv.appApiServicePorts = appEnv.envConfig.APP_PORTS.APP_API_SERVICES_PORTS;

	appEnv.appEventsApiServicePorts = appEnv.envConfig.APP_PORTS.APP_EVENTS_API_SERVICES_PORTS;

	appEnv.aggControllerApiServicePorts = appEnv.envConfig.APP_PORTS.AGG_CONTROLLER_API_SERVICES_PORTS;

	if (appEnv.envConfig.EVENTS_LOG_DIRECTORY == null || appEnv.envConfig.EVENTS_LOG_DIRECTORY == "") {
		appEnv.envConfig.EVENTS_LOG_DIRECTORY = appEnv.appPath + '/event_push_logs';
	}
	else {
		let event_logs_dir = appEnv.envConfig.EVENTS_LOG_DIRECTORY;

		event_logs_dir = ('/' + event_logs_dir.split('/').filter(function (elem) { return (elem != '' ? true : false); }).join('/'));

		let fs_temp = require("fs");

		if (!fs_temp.existsSync(event_logs_dir)) {
			throw "Invalid log directory!";
		}

		appEnv.envConfig.EVENTS_LOG_DIRECTORY = event_logs_dir + '/event_push_logs';
	}

	appEnv.appInfo = { "appName": appEnv.envConfig.APP_NAME };

	if (["default", "reporting", "logging"].includes(servicesGroup)) {
		// Initializing Mail Facilitator.
		appEnv.sendSMTPEmail = require(appEnv.appPath + '/src/base/sendSMTPEmail');
	}

	if (["default", "reporting", "logging"].includes(servicesGroup)) {
		// Initializing SMS Facilitator.
		appEnv.smsHandler = require(appEnv.appPath + '/src/base/smsHandler');
	}

	if (["default", "reporting"].includes(servicesGroup)) {
		// Initializing PostgreSQL DB Object and also adding it to default DB Object.
		appEnv.postgreQryBldr = require(appEnv.appPath + '/src/base/postgresqlQueryBuilder');
		// Default DB object.
		appEnv.qryBldr = require(appEnv.appPath + '/src/base/postgresqlQueryBuilder');
	}

	// if (appEnv.envConfig.hasOwnProperty('SECONDARY_DATABASES') && appEnv.envConfig.SECONDARY_DATABASES.includes('MYSQL')) {
	// 	// Initializing MySQL DB Object.
	// 	appEnv.mysqlQryBldr = require(appEnv.appPath + '/src/base/mysqlQueryBuilder');
	// }

	// if (["default", "reporting"].includes(servicesGroup)) {
	// 	if (!appEnv.envConfig.hasOwnProperty('SECONDARY_DATABASES') || (appEnv.envConfig.hasOwnProperty('SECONDARY_DATABASES') && appEnv.envConfig.SECONDARY_DATABASES.includes('MSSQL'))) {
	// 		// Initializing MSSQL DB Object.
	// 		// appEnv.mssqlQryBldr = require(appEnv.appPath + '/src/base/mssqlQueryBuilder');
	// 	}
	// }

	if (["default", "reporting"].includes(servicesGroup)) {
		// Initializing Mongo DB Object.
		// appEnv.mongoOBJ = require(appEnv.appPath + '/src/base/mongoConnector');
		// appEnv.mongoTxnOBJ = require(appEnv.appPath + '/src/base/mongoTxnQueryBuilder');
		// (new appEnv.mongoTxnOBJ).collection(0, appEnv, "org_21334434_data").aggregateNC([{}], function(err, d) {});
	}

	if (["default", "reporting", "logging"].includes(servicesGroup)) {
		// Initializing SQLite DB Object.
		// appEnv.sqliteDatastore = require(appEnv.appPath + '/src/base/sqliteDatastore');
	}

	if (["default", "reporting"].includes(servicesGroup)) {
		// Initializing Aggregated Query Builder Object.
		appEnv.aggQryBldr = require(appEnv.appPath + '/src/base/aggQueryBuilder');
	}

	// Creating instance of request handler, session and other HTTP APIs facilitators.
	appEnv.reqHndlr = require(appEnv.appPath + '/src/base/requestHandler');
	appEnv.sessionOBJ = require(appEnv.appPath + '/src/base/sessionHandler');
	appEnv.renderResource = require(appEnv.appPath + '/src/base/renderResource');
	appEnv.responseGenerator = require(appEnv.appPath + '/src/base/responseGenerator');
	appEnv.cookieOBJ = require(appEnv.appPath + '/src/base/cookieHandler');

	// Creating instance of error reporting function
	appEnv.handleErrorLogs = require(appEnv.appPath + '/src/base/handleErrorLogs');

	// Initializing Test Automation Object.
	appEnv.testAutomationObj = require(appEnv.appPath + '/src/base/testAutomationConnector');

	// Initializing IP to Location resolver.
	appEnv.ipLocationResolvr = require(appEnv.appPath + "/src/generic/ip-location");

	return appEnv;
};

module.exports = {
	getAppEnvironment: getAppEnvironment
};
