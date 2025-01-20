//Moodified by : Manish Jain
//Modified on : 24-April-2018
//Reason : Making compatible with multiple connections.

// Modified by: Manish Jain
// On: 2022-01-17 14:00
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2022-01-03 14:15
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

const postgres_obj = require('pg');
const fs = require('fs');

// To fix the issue where node-pg adds the time difference.
// let types = postgres_obj.types;
// types.setTypeParser(1114, function(stringValue) {
// 	return stringValue;
// });

let server_config = [];

try {
	let temp_pg_server_confg = [];

	for (let itr1 = 0; itr1 < 10; itr1++) {
		if (process.env.hasOwnProperty("MG_PG_HOST_" + itr1) && process.env.hasOwnProperty("MG_PG_USER_" + itr1) && process.env.hasOwnProperty("MG_PG_PASS_" + itr1) && process.env.hasOwnProperty("MG_PG_PORT_" + itr1) && process.env.hasOwnProperty("MG_PG_DB_" + itr1) && process.env.hasOwnProperty("MG_PG_SCHEMA_" + itr1)) {
			let temp_pg_db_object = {};

			temp_pg_db_object["host"] = process.env["MG_PG_HOST_" + itr1];
			temp_pg_db_object["user"] = process.env["MG_PG_USER_" + itr1];
			temp_pg_db_object["port"] = parseInt(process.env["MG_PG_PORT_" + itr1]);
			temp_pg_db_object["password"] = process.env["MG_PG_PASS_" + itr1];
			temp_pg_db_object["database"] = process.env["MG_PG_DB_" + itr1];
			temp_pg_db_object["defaultSchema"] = process.env["MG_PG_SCHEMA_" + itr1];

			// Initializing default values for the rest of parameters
			temp_pg_db_object["max"] = 100;
			temp_pg_db_object["idleTimeoutMillis"] = 1000;
			temp_pg_db_object["ssl"] = true;

			// Override values if its present in env variables
			if (process.env.hasOwnProperty("MG_PG_MAXCONN_" + itr1)) {
				temp_pg_db_object["max"] = parseInt(process.env["MG_PG_MAXCONN_" + itr1]);
			}

			if (process.env.hasOwnProperty("MG_PG_IDLETIME_" + itr1)) {
				temp_pg_db_object["idleTimeoutMillis"] = parseInt(process.env["MG_PG_IDLETIME_" + itr1]);
			}

			if (process.env.hasOwnProperty("MG_PG_SSL_" + itr1)) {
				temp_pg_db_object["ssl"] = (process.env["MG_PG_SSL_" + itr1].toLowerCase() == "true" ? true : false);
			}

			temp_pg_server_confg.push(temp_pg_db_object);
		}
		else {
			break;
		}
	}

	if (temp_pg_server_confg.length > 0) {
		server_config = JSON.parse(JSON.stringify(temp_pg_server_confg));
	}
	else {
		const YAML = require('yaml');

		const postgresql_config_file = fs.readFileSync('./server_config/postgres_config.yaml', 'utf8');
		server_config = YAML.parse(postgresql_config_file)["postgres_config"];
		// server_config = require('../../server_config/postgres_config').getConfig();
	}
}
catch (e) {
	console.error(e);
	console.log("PostgreSQL config missing.");
	throw Error("PostgreSQL config missing.");
}

let dbConn = [];
let pg_default_schema = [];

for (let i = 0; i < server_config.length; i++) {
	dbConn.push(new postgres_obj.Pool(server_config[i]));
	pg_default_schema.push(server_config[i]["defaultSchema"]);
}

// let pool = new postgres_obj.Pool(server_config);

let queryString = '';
let argumentString = '';
let failed_connect_attempts = 0;

const processMultipleQueriesRecursive = function (querryArr, conn, pmqrCB) {
	conn.query(querryArr.shift(), [], function (err, result) {
		if (err) {
			pmqrCB(err, null);
		}
		else if (querryArr.length >= 1) {
			processMultipleQueriesRecursive(querryArr, conn, pmqrCB);
		}
		else {
			pmqrCB(null, true);
		}
	});
};

const executeQuery = function (dbConnIndex, queryString, paramsArray, callback) {
	try {
		for (let isx0 = 0; isx0 < paramsArray.length; isx0++) {
			if (typeof paramsArray[isx0] == "string") {
				paramsArray[isx0] = paramsArray[isx0].replace('`', '’').replace(/'/g, '’');
			}
		}

		const processQuery = function (attempCount, conn, done) {
			conn.query(queryString, paramsArray, function (err, result) {

				if (err && ["42P01"].includes(err.code)) {
					let schema_and_table = (err.toString().split('"')[1]).split('.');

					const getSchemaQuery = require('./pgDBModels').getSchemaQuery;
					let schema_queries = getSchemaQuery(schema_and_table[1], schema_and_table[0]);

					console.log("Creating missing Table/Indexes.");

					processMultipleQueriesRecursive(schema_queries, conn, function (err, status) {
						if (!err) {
							attempCount++;
							processQuery(attempCount, conn, done);
						}
						else {
							done();
							callback(err, null);
						}
					});
				}
				else if (err && attempCount < 2) {
					attempCount++;
					processQuery(attempCount, conn, done);
				}
				else if (err) {
					done();
					callback(err, null);
				}
				else {
					done();
					callback(null, result.rows);
				}
			});
		};

		const establishConnection = function () {
			dbConn[dbConnIndex].connect(function (err, conn, done) {

				if (err && failed_connect_attempts > 9) {
					callback(err, null);
					dbConn[dbConnIndex] = new postgres_obj.Pool(server_config[dbConnIndex]);
					failed_connect_attempts = 0;
					return;
				}
				else if (err) {
					callback(err, null);
					failed_connect_attempts++;
					return;
				}
				else {
					processQuery(0, conn, done);
				}
			});
		};

		establishConnection();
	}
	catch (err) {
		callback(err, null);
	}
};

const insertMany = function (dbConnIndex, tableName, fieldsName, paramsArray, callback) {
	try {
		for (let isx0 = 0; isx0 < paramsArray.length; isx0++) {
			if (typeof paramsArray[isx0] == "string") {
				paramsArray[isx0] = paramsArray[isx0].replace('`', '’').replace(/'/g, '’');
			}
		}

		const processQuery = function (attempCount, queryString, newArr, conn, done) {
			conn.query(queryString, newArr, function (err, result) {
				if (err && ["42P01"].includes(err.code)) {
					let schema_and_table = (err.toString().split('"')[1]).split('.');

					const getSchemaQuery = require('./pgDBModels').getSchemaQuery;
					let schema_queries = getSchemaQuery(schema_and_table[1], schema_and_table[0]);

					console.log("Creating missing Table/Indexes.");

					processMultipleQueriesRecursive(schema_queries, conn, function (err, status) {
						if (!err) {
							attempCount++;
							processQuery(attempCount, queryString, newArr, conn, done);
						}
						else {
							done();
							callback(err, null);
						}
					});
				}
				else if (err && attempCount < 2) {
					attempCount++;
					processQuery(attempCount, queryString, newArr, conn, done);
				}
				else if (err) {
					done();
					callback(err, null);
				}
				else {
					done();
					callback(null, result.rows);
				}
			});
		};

		dbConn[dbConnIndex].connect(function (err, conn, done) {
			if (err && failed_connect_attempts > 9) {
				callback(err, null);
				dbConn[dbConnIndex] = new postgres_obj.Pool(server_config[dbConnIndex]);
				failed_connect_attempts = 0;
				return;
			}
			else if (err) {
				callback(err, null);
				failed_connect_attempts++;
				return;
			}

			let k = 1;
			let argumentString = '';

			for (let i = 1; i <= paramsArray.length; i++) {
				let tempString = "";
				for (let j = 1; j <= fieldsName.length; j++) {
					tempString = tempString + ',$' + k;
					k++;
				}
				argumentString = argumentString + ',(' + tempString.substring(1, tempString.length) + ')';
			}

			let queryString = "INSERT INTO " + tableName + "(" + fieldsName.join(', ') + ") VALUES " + argumentString.substring(1, argumentString.length) + ";";

			let newArr = [];

			for (let i = 0; i < paramsArray.length; i++) {
				newArr = newArr.concat(paramsArray[i]);
			}

			processQuery(0, queryString, newArr, conn, done);
		});
	}
	catch (err) {
		callback(err, null);
	}
};

const insertManyIgnoreDuplicates = function (dbConnIndex, tableName, fieldsName, paramsArray, callback) {
	try {
		for (let isx0 = 0; isx0 < paramsArray.length; isx0++) {
			if (typeof paramsArray[isx0] == "string") {
				paramsArray[isx0] = paramsArray[isx0].replace('`', '’').replace(/'/g, '’');
			}
		}

		const processQuery = function (attempCount, queryString, newArr, conn, done) {
			conn.query(queryString, newArr, function (err, result) {
				if (err && ["42P01"].includes(err.code)) {
					let schema_and_table = (err.toString().split('"')[1]).split('.');

					const getSchemaQuery = require('./pgDBModels').getSchemaQuery;
					let schema_queries = getSchemaQuery(schema_and_table[1], schema_and_table[0]);

					console.log("Creating missing Table/Indexes.");

					processMultipleQueriesRecursive(schema_queries, conn, function (err, status) {
						if (!err) {
							attempCount++;
							processQuery(attempCount, queryString, newArr, conn, done);
						}
						else {
							done();
							callback(err, null);
						}
					});
				}
				else if (err && attempCount < 2) {
					attempCount++;
					processQuery(attempCount, queryString, newArr, conn, done);
				}
				else if (err) {
					done();
					callback(err, null);
				}
				else {
					done();
					callback(null, result.rows);
				}
			});
		};

		dbConn[dbConnIndex].connect(function (err, conn, done) {
			if (err && failed_connect_attempts > 9) {
				callback(err, null);
				dbConn[dbConnIndex] = new postgres_obj.Pool(server_config[dbConnIndex]);
				failed_connect_attempts = 0;
				return;
			}
			else if (err) {
				callback(err, null);
				failed_connect_attempts++;
				return;
			}

			let k = 1;
			let argumentString = '';

			for (let i = 1; i <= paramsArray.length; i++) {
				let tempString = "";
				for (let j = 1; j <= fieldsName.length; j++) {
					tempString = tempString + ',$' + k;
					k++;
				}
				argumentString = argumentString + ',(' + tempString.substring(1, tempString.length) + ')';
			}

			let queryString = "INSERT INTO " + tableName + "(" + fieldsName.join(', ') + ") VALUES " + argumentString.substring(1, argumentString.length) + " ON CONFLICT DO NOTHING;";

			let newArr = [];

			for (let i = 0; i < paramsArray.length; i++) {
				newArr = newArr.concat(paramsArray[i]);
			}

			processQuery(0, queryString, newArr, conn, done);
		});
	}
	catch (err) {
		callback(err, null);
	}
};

module.exports = {
	executeQuery: executeQuery,
	insertMany: insertMany,
	insertManyIgnoreDuplicates: insertManyIgnoreDuplicates,
	pg_default_schema: pg_default_schema
};
