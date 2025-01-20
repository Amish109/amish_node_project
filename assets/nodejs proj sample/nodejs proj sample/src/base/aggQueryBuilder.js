//Moodified by : Manish Jain
//Modified on : 2021-Sep-08 04:36 PM
//Reason : Aggregated Secondary database connector.

// Modified by: Manish Jain
// On: 2022-01-17 11:00
// Reason: function syntax generalization

let executeQuery = function (dbConnIndex, appEnv, queryStringAndParams, callback) {
	try {
		if (appEnv.envConfig.hasOwnProperty("DEFAULT_SECONDARY_DATABASES") && appEnv.envConfig.hasOwnProperty("SECONDARY_DATABASES") && appEnv.envConfig.SECONDARY_DATABASES.length > 0 && appEnv.envConfig.SECONDARY_DATABASES.includes(appEnv.envConfig.DEFAULT_SECONDARY_DATABASES)) {
			if (appEnv.envConfig.DEFAULT_SECONDARY_DATABASES == "MSSQL") {
				if (queryStringAndParams.hasOwnProperty("mssql") && queryStringAndParams.mssql.hasOwnProperty("sqlQuery") && queryStringAndParams.mssql.hasOwnProperty("parameters")) {
					appEnv.mssqlQryBldr.executeQuery(dbConnIndex, queryStringAndParams.mssql.sqlQuery, queryStringAndParams.mssql.parameters, callback);
				}
				else {
					callback("Invalid or Missing query object/params.", []);
				}
			}
			else if (appEnv.envConfig.DEFAULT_SECONDARY_DATABASES == "MYSQL") {
				if (queryStringAndParams.hasOwnProperty("mysql") && queryStringAndParams.mysql.hasOwnProperty("sqlQuery") && queryStringAndParams.mysql.hasOwnProperty("parameters")) {
					appEnv.mysqlQryBldr.executeQuery(dbConnIndex, queryStringAndParams.mysql.sqlQuery, queryStringAndParams.mysql.parameters, callback);
				}
				else {
					callback("Invalid or Missing query object/params.", []);
				}
			}
			else {
				callback("Invalid or Missing Configuration.", []);
			}
		}
		else {
			callback("Invalid or Missing Configuration.", []);
		}
	}
	catch (err) {
		callback(err, []);
	}
};

module.exports = {
	executeQuery: executeQuery
};
