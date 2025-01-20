// @author: Manish Jain
// Created on: 2024-10-15 11:00
// Description: Nodejs Maintenance Scheduler.

"use strict";

// Creating app environment.
const appEnv = require('./src/base/appEnvironmentBuilder').getAppEnvironment(__dirname, "default");
const log_unique_id = require("uuid4")().toString();

// Custom code imports
const string_functions = require(appEnv.appPath + '/src/generic/string-functions');
let db_index = 0;

// let semaphore_sync_process = 0;
let operator_distributor_count_semaphore_sync_process = 0;
let fg_txn_status_semaphore_sync_process = 0;


// ----- Execution Starts from Here -----

let operator_distributor_count_sync_cron = require('node-schedule');
let fg_txn_status_sync_cron = require('node-schedule');

operator_distributor_count_sync_cron.scheduleJob('0 0 * * * *', function () {
	console.log("Operator Distributor Count sync job triggered on: ", string_functions.getCurrentTimestampInString());

	if (operator_distributor_count_semaphore_sync_process == 0) {

		operator_distributor_count_semaphore_sync_process = 1;
	}
});

fg_txn_status_sync_cron.scheduleJob('*/15 * * * * *', function () {

	if (fg_txn_status_semaphore_sync_process == 0) {
		console.log("FG Txn status sync job triggered on: ", string_functions.getCurrentTimestampInString());

		fg_txn_status_semaphore_sync_process = 1;

	}
});