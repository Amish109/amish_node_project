// @author: Manish Jain
// Created on: 2022-05-02 10:09 AM
// Description: Generic module to generate excel.
"use strict";

let createExcelWorkbook = function (jsonData) {
	try {
		const string_functions = require('../generic/string-functions');

		jsonData = JSON.parse(JSON.stringify(jsonData));
		// Require library
		let excel = require('excel4node');

		// Create a new instance of a Workbook class
		let workbook = new excel.Workbook();

		let iterator_index = 0;
		const max_book_rows = 1000000;

		while (iterator_index < jsonData.length) {
			try {
				// Add Worksheets to the workbook
				let workbook_name = "Book " + (iterator_index + 1);
				if (jsonData[iterator_index].hasOwnProperty('metadata') && jsonData[iterator_index]["metadata"].hasOwnProperty('bookName')) {
					workbook_name = jsonData[iterator_index]["metadata"]["bookName"];
				}

				let worksheet = workbook.addWorksheet(workbook_name);
				let workbook_breakdown_iterator = 1;

				// Freeze first n rows
				if (jsonData[iterator_index].hasOwnProperty('metadata') && jsonData[iterator_index]["metadata"].hasOwnProperty('freezeNumberOfTopRows')) {
					worksheet.row(jsonData[iterator_index]["metadata"]["freezeNumberOfTopRows"]).freeze();
				}

				// Start populating workbook data
				if (jsonData[iterator_index].hasOwnProperty('workbookData')) {
					let row_merge_metadata = {};

					for (let itr1 = 0; itr1 < jsonData[iterator_index]["workbookData"].length; itr1++) {
						if ((itr1 / max_book_rows) > workbook_breakdown_iterator) {
							workbook_breakdown_iterator++;
							worksheet = workbook.addWorksheet(workbook_name + " (" + workbook_breakdown_iterator + ")");

							// Freeze first n rows
							if (jsonData[iterator_index].hasOwnProperty('metadata') && jsonData[iterator_index]["metadata"].hasOwnProperty('freezeNumberOfTopRows')) {
								worksheet.row(jsonData[iterator_index]["metadata"]["freezeNumberOfTopRows"]).freeze();

								try {
									const row_data_0 = JSON.parse(JSON.stringify(jsonData[iterator_index]["workbookData"][0]["rowData"]));
									let row_style_0 = jsonData[iterator_index]["workbookData"][0]["style"];

									for (let cel0 = 0; cel0 < row_data_0.length; cel0++) {
										worksheet.cell(1, (cel0 + 1)).string((row_data_0[cel0]["value"] || "").toString()).style(row_style_0);
									}
								} catch (err) { console.error(err); }
							}
						}

						let row_style = null;

						if (jsonData[iterator_index]["workbookData"][itr1].hasOwnProperty('style')) {
							row_style = jsonData[iterator_index]["workbookData"][itr1]["style"];
						}

						if (jsonData[iterator_index]["workbookData"][itr1].hasOwnProperty('rowData')) {
							const row_data = JSON.parse(JSON.stringify(jsonData[iterator_index]["workbookData"][itr1]["rowData"]));

							let cell_index_iterator = 1;
							for (let itr2 = 0; itr2 < row_data.length; itr2++) {
								// Calculating cell cordinates taking into consideration row and col span.
								if (row_merge_metadata.hasOwnProperty((itr1 + 1).toString())) {
									for (let itx2 = 0; itx2 < row_merge_metadata[(itr1 + 1).toString()].length; itx2++) {
										let tmp_rmm = row_merge_metadata[(itr1 + 1).toString()][itx2];

										if (cell_index_iterator >= tmp_rmm['x1'] && cell_index_iterator <= tmp_rmm['x2']) {
											cell_index_iterator = tmp_rmm['x2'] + 1;
										}
									}
								}

								let y1 = (itr1 - (max_book_rows * (workbook_breakdown_iterator - 1))) + 1;
								let x1 = cell_index_iterator;
								let y2 = y1;
								let x2 = x1;

								if (row_data[itr2].hasOwnProperty('colSpan') && row_data[itr2]["colSpan"] > 1) {
									x2 = x1 + (row_data[itr2]["colSpan"] - 1);
									cell_index_iterator = x2;
								}

								if (row_data[itr2].hasOwnProperty('rowSpan') && row_data[itr2]["rowSpan"] > 1) {
									y2 = y1 + (row_data[itr2]["rowSpan"] - 1);

									for (let itx1 = (y1 + 1); itx1 <= y2; itx1++) {
										if (!row_merge_metadata.hasOwnProperty(itx1.toString())) {
											row_merge_metadata[itx1.toString()] = [];
										}

										row_merge_metadata[itx1.toString()].push({ "x1": x1, "x2": x2 });
									}
								}

								let curr_cell_ref = null;

								if (x1 != x2 || y1 != y2) {
									curr_cell_ref = worksheet.cell(y1, x1, y2, x2, true).string((row_data[itr2]["value"] || "").toString());
								}
								else {
									curr_cell_ref = worksheet.cell(y1, x1).string((row_data[itr2]["value"] || "").toString());
								}

								// Applying row level style
								if (row_style != null) {
									curr_cell_ref.style(row_style);
								}

								// Applying cell level styles
								if (row_data[itr2].hasOwnProperty('style')) {
									curr_cell_ref.style(row_data[itr2]["style"]);
								}

								cell_index_iterator++;
							}
						}
					}
				}
			}
			catch (err) { }

			iterator_index++;
		}

		return workbook;
	}
	catch (err) {
		return 0;
	}
};

module.exports = {
	exportToExcel: function (appEnv, jsonData, responseObject, requestObject, writeToFile = false) {
		try {
			let workbook = createExcelWorkbook(jsonData);

			const string_functions = require('../generic/string-functions');

			const log_unique_id = require("uuid4")().toString();
			const unique_id = require("uuid4")().toString();
			const file_name = "Export_Excel_" + unique_id + ".xlsx";
			const expiry_time = string_functions.getCurrentTimestampInUnix() + 1800000;

			if (writeToFile == false) {
				workbook.write(file_name, responseObject);
			}
			else {
				let fs = require('fs');

				if (!fs.existsSync(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/')) {
					fs.mkdirSync(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/');
				}

				workbook.write(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/' + file_name, function (e, d) {
					const crypto_sha256 = require("crypto-js/sha256");
					const { base64encode, base64decode } = require('nodejs-base64');

					let file_access_signature = base64encode(JSON.stringify({ "hash": crypto_sha256(file_name + appEnv.envConfig.FILE_SIGNATURE_KEY + expiry_time).toString(), "expiry": expiry_time }));
					// console.log({"viewerUrl": "https://view.officeapps.live.com/op/view.aspx?src="  + appEnv.envConfig.APP_BASE_DOMAIN[0] + "/public/v1/file/"});
					responseObject.send({ "viewerUrl": "https://view.officeapps.live.com/op/view.aspx?src=" + appEnv.envConfig.APP_BASE_DOMAIN[0] + "/public/v1/file/" + file_name + "?signature=" + file_access_signature });
					// responseObject.send({ "viewerUrl":  appEnv.envConfig.APP_BASE_DOMAIN[0] + "/public/v1/file/" + file_name});
				});
			}
		}
		catch (err) {
			console.log("Error occurred:", err);
			appEnv.responseGenerator.sendResponse(responseObject, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
			return;
		}
	},

	writeToExcelFile: function (appEnv, jsonData, callback) {
		try {
			let workbook = createExcelWorkbook(jsonData);

			console.log("workbook: ", jsonData);
			if (workbook != 0) {
				const log_unique_id = require("uuid4")().toString();
				const unique_id = require("uuid4")().toString();
				const file_name = "Export_Excel_" + unique_id + ".xlsx";

				let fs = require('fs');

				if (!fs.existsSync(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/')) {
					fs.mkdirSync(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/');
				}

				workbook.write(appEnv.envConfig.EVENTS_LOG_DIRECTORY + '/temp/' + file_name, function (err, stats) {
					callback(file_name);
					return;
				});
			}
			else {
				callback("");
				return;
			}
		}
		catch (err) {
			callback("");
			return;
		}
	},

	importFromCSV: function (appEnv, filePath, responseObject, callback) {
		const csv = require('csv-parser');
		const fs = require('fs');

		const results = [];
		fs.createReadStream(filePath)
			.pipe(csv({ header: true, trim: true, auto_parse: true }))
			.on('data', (data) => results.push(data))
			.on('end', async () => {
				try {
					console.log("results: ", JSON.stringify(results));

					for (let itr = 0; itr < results.length; itr++) {
						appEnv.postgreQryBldr.executeQuery(0, `
							INSERT INTO public.insurance_company ( name, description ) VALUES ( $1, $2 ) RETURNING *
						`, [results[itr]["Name"], results[itr]["Description"]], function (err, result) {

							if (err) {
								console.log("Error: ", err);
								callback();
								return;
							}

							console.log("Result: ", result);
						});
					}

					appEnv.responseGenerator.sendResponse(responseObject, false, 200, results, 0, null);
					return;
				}
				catch (e) {
					console.error('Error importing data:', e);
					appEnv.responseGenerator.sendResponse(responseObject, true, 500, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
					return;
				}
				finally {
					console.log('Data imported successfully');
				}
			});
	},
};