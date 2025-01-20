// @author: Manish Jain
// Created on: 2020-02-12 11:52 AM
// Description: IP to Location function.
"use strict";

// Modified by: Manish Jain
// On: 2022-01-18 14:00
// Reason: function syntax generalization

// const IPSTACK_ACCESS_KEYS = [
// 	"4b1f96b8985472b95347bc097fff1688",
// 	"0aa9c3065b1c924da2f13a86063332a8",
// 	"71ce93f5b68e1b3cbb2ed08157d30bf9",
// 	"85fd50dd7fff12c7932f4f2bab341e76",
// 	"a3e2ea566cb2520ee304d6eb16c26501",
// 	"56a8fa0077c623d8787fd1cd29af7ae4",
// 	"3cfde8bf73fd2aa2393d9885a450c80e",
// 	"3688d20daddf844f174cd416ee297fc6",
// 	"7197dcedb5306ca9b667e6f57398a900",
// 	"bfa2b10fbc4936b45d17d1243b4e9e0f",
// 	"a98539e5c003a5db97e75b36d8bc4295",
// 	"d06902d03909e3a33b4c5b95a6f2064e",
// 	"bdfe3c96d7a63a193057a7776deaab02",
// 	"b2e0a63861f4526cb0bfae1f5c15f87a",
// 	"a57e6e3026137d522444a46a790b04a1",
// 	"6a13990b21a90130e1845680f8b5ded9",
// 	"5b62b2b68488376340ae3408bb398ee2",
// 	"d4dbe06afcd48c0d06240c9e612c42e6",
// 	"a508beeb110e4b6cd3ad89809ada248a",
// 	"61d9227a5b2a1484f6514dc915495cf9",
// 	"83184c89268c5463aa80bb576e39d1ab",
// 	"fd3f2aaf5df746ef6fbc8af5f1990a0c",
// 	"7813eca169034b55e3be6ee7999b046d",
// 	"2f682727e8d3db35c0acff23c46bd9ef",
// 	"9fb88335044d7354e97b06596b7936ad",
// 	"bc5a0922548ed2ab0523b55344c62a07",
// 	"1026426bd4da3796b4f55c6b277a172d"
// ];

let ACCESS_KEY_BIFURCATION = {};

let ipToLocation = function (appEnv, dbIndex, ipAddress, callBack) {
	// var returnObject = {};
	const log_unique_id = require("uuid4")().toString();

	try {
		let current_time = new Date();

		let bifurcation_key = current_time.getFullYear() + "-" + (current_time.getMonth() + 1) + "-" + current_time.getDate();

		if (!ACCESS_KEY_BIFURCATION.hasOwnProperty(bifurcation_key)) {
			ACCESS_KEY_BIFURCATION = {};
			ACCESS_KEY_BIFURCATION[bifurcation_key] = {};
			ACCESS_KEY_BIFURCATION[bifurcation_key]["active"] = JSON.parse(JSON.stringify(appEnv.envConfig.IPSTACK_ACCESS_KEYS));
			ACCESS_KEY_BIFURCATION[bifurcation_key]["exhausted"] = [];
		}

		appEnv.postgreQryBldr.executeQuery(dbIndex, "SELECT * FROM " + appEnv.postgreQryBldr.pg_default_schema[dbIndex] + ".hist_ip_location_cache WHERE ip = $1 AND is_obsolete = 0 AND row_add_timestamp > CURRENT_DATE - INTERVAL '7' day;", [ipAddress], function (err, selectData) {
			if (!err && selectData.length > 0) {
				callBack(null, selectData[0]);
			}
			else {
				let Client = require('node-rest-client').Client;

				let fetchIPLocation = function (attemptCount, callbackFunc) {
					if (ACCESS_KEY_BIFURCATION[bifurcation_key]["active"].length > 0) {
						const URLGenerator = require(appEnv.appPath + '/src/entity/URLGenerator');

						let url_object = new URLGenerator("http://api.ipstack.com", ("/" + ipAddress), {}, { "access_key": ACCESS_KEY_BIFURCATION[bifurcation_key]["active"][0], "format": "2" });

						let client = new Client();

						client.get(url_object.parseURL(), function (data, response) {
							if (typeof data == 'object' && data.success === false && [104, 101].includes(data.error.code)) {
								// Re-attempt logic for limit exhaust.
								ACCESS_KEY_BIFURCATION[bifurcation_key]["exhausted"].push(ACCESS_KEY_BIFURCATION[bifurcation_key]["active"].shift());

								fetchIPLocation(attemptCount, callbackFunc);
							}
							else if (attemptCount <= 3 && (data === undefined || data === null || typeof data != 'object')) {
								// Re-attempt logic for API error.
								fetchIPLocation((attemptCount + 1), callbackFunc);
							}
							else {
								callbackFunc(data, response);
							}
						});
					}
					else {
						callbackFunc(null, null);
					}
				};

				const ipfetch = require('ip-fetch');

				let info = {};

				let fetchIpSource0 = async () => {
					try {
						info = await ipfetch.getLocationNpm(ipAddress);
					}
					catch (e) {
						info = { "status": "failed" };
					}

					if (typeof info == 'object' && info.hasOwnProperty("status") && info.status == 'success') {
						let loc = {};

						loc.ip = info.query;
						loc.city = info.city;
						loc.region = info.regionName;
						loc.region_code = info.region;
						loc.country = info.countryCode;
						loc.country_name = info.country;
						loc.country_code = info.countryCode;
						loc.postal = info.zip;
						loc.latitude = info.lat;
						loc.longitude = info.lon;
						loc.timezone = info.timezone;

						callBack(null, loc);

						if (!err && loc.hasOwnProperty('ip')) {
							appEnv.postgreQryBldr.executeQuery(dbIndex, "INSERT INTO " + appEnv.postgreQryBldr.pg_default_schema[dbIndex] + ".hist_ip_location_cache (ip, continent_code, continent_name, country_code, country_name, region_code, region_name, city, zip, latitude, longitude, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);", [loc.ip, loc.continent_code, loc.continent_name, loc.country_code, loc.country_name, loc.region_code, loc.region_name, loc.city, loc.postal, loc.latitude, loc.longitude, JSON.stringify(loc)], function (err, insertStatus) {
								// Do nothing
							});
						}

						return;
					}
					else {
						// Attempt to get location from ipapi API
						var https = require('https');

						const options = {
							path: '/' + ipAddress + '/json/',
							host: 'ipapi.co',
							port: 443,
							headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
						};

						https.get(options, function (resp) {
							var body = '';
							resp.on('data', function (data) {
								body += data;
							});

							resp.on('end', function () {
								let loc = JSON.parse(body);

								if (loc.hasOwnProperty('ip')) {
									callBack(null, loc);

									if (!err && loc.hasOwnProperty('ip')) {
										appEnv.postgreQryBldr.executeQuery(dbIndex, "INSERT INTO " + appEnv.postgreQryBldr.pg_default_schema[dbIndex] + ".hist_ip_location_cache (ip, continent_code, continent_name, country_code, country_name, region_code, region_name, city, zip, latitude, longitude, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);", [loc.ip, loc.continent_code, loc.continent_name, loc.country_code, loc.country_name, loc.region_code, loc.region_name, loc.city, loc.postal, loc.latitude, loc.longitude, JSON.stringify(loc)], function (err, insertStatus) {
											// Do nothing
										});
									}
								}
								else {
									fetchIPLocation(1, function (data, response) {
										try {
											callBack(null, data);

											if (!err && data.hasOwnProperty('ip')) {
												appEnv.postgreQryBldr.executeQuery(dbIndex, "INSERT INTO " + appEnv.postgreQryBldr.pg_default_schema[dbIndex] + ".hist_ip_location_cache (" + Object.keys(data) + ") VALUES (" + Object.values(data).map(function (elem, i) { return '$' + (i + 1); }) + ");", Object.values(data).map(function (elem) { return (typeof elem == 'object' ? JSON.stringify(elem) : elem); }), function (err, insertStatus) {
													// Do nothing
												});
											}
										}
										catch (err) {

											appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)), appEnv, 5, err, 3, __filename, "", log_unique_id, errorHandlerMiscExtractor(appEnv, null));
											callBack(err, null);
										}
									});
								}
							});
						}).on('error', function (e) {
							fetchIPLocation(1, function (data, response) {
								try {
									callBack(null, data);

									if (!err && data.hasOwnProperty('ip')) {
										appEnv.postgreQryBldr.executeQuery(dbIndex, "INSERT INTO " + appEnv.postgreQryBldr.pg_default_schema[dbIndex] + ".hist_ip_location_cache (" + Object.keys(data) + ") VALUES (" + Object.values(data).map(function (elem, i) { return '$' + (i + 1); }) + ");", Object.values(data).map(function (elem) { return (typeof elem == 'object' ? JSON.stringify(elem) : elem); }), function (err, insertStatus) {
											// Do nothing
										});
									}
								}
								catch (err) {

									appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)), appEnv, 5, err, 3, __filename, "", log_unique_id, errorHandlerMiscExtractor(appEnv, null));
									callBack(err, null);
								}
							});
						});
					}
				};

				// Start IP fetch procedure
				fetchIpSource0();
			}
		});
	}
	catch (err) {

		appEnv.handleErrorLogs.emailErrorLogs(appEnv.envConfig.APP_KEY.indexOf(req.sanitize(req.headers.appkey)), appEnv, 5, err, 3, __filename, "", log_unique_id, errorHandlerMiscExtractor(appEnv, null));
		callBack(err, null);
	}
};

module.exports = {
	ipToLocation: ipToLocation
};