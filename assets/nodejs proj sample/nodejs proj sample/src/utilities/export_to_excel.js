// @author: Manish Jain
// Created on: 2018-04-28 9:09 AM
// Description: Function to store log files to DB.

// Updated by: Manish Jain
// updated on: 2018-04-30 15:00
// Description: Seperated functions to make compatible with export background job.

"use strict";

let createExcelWorkbook = function (jsonData) {
	try {
		const string_functions = require('../generic/string-functions');

		jsonData = JSON.parse(JSON.stringify(jsonData));
		// Require library
		let excel = require('excel4node');

		// Create a new instance of a Workbook class
		let workbook = new excel.Workbook();

		// Add Worksheets to the workbook
		let worksheet = workbook.addWorksheet('Sheet 1');

		// Create a reusable style
		let style = workbook.createStyle({
			font: {
				color: '#333333',
				size: 14
			},
			numberFormat: '#,##; ($#,##); -'
		});

		let iterator_index = 0;
		let is_header_added = false;
		let header_width_offset = [];

		while (iterator_index < jsonData.length) {
			if (is_header_added == false) {
				let cell_index_header = 1;
				for (let property_key in jsonData[iterator_index]) {
					if (property_key[0] != '_') {
						worksheet.cell(iterator_index + 1, cell_index_header).string(string_functions.titleCase(property_key.toString().replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2"))).style(style).style({ font: { bold: true, color: "#ffffff" }, alignment: { horizontal: 'center', wrapText: true, vertical: 'center', indent: 1 }, fill: { type: "pattern", patternType: "solid", bgColor: "#4b4b7b", fgColor: "#4b4b7b" } });
						header_width_offset[cell_index_header] = string_functions.titleCase(property_key.toString().replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")).length;
						worksheet.column(cell_index_header).setWidth(Math.floor(header_width_offset[cell_index_header] * 1.4));
						cell_index_header++;
					}
				}
				is_header_added = true;

				worksheet.row(1).freeze();
			}

			let cell_index = 1;
			for (let property_key in jsonData[iterator_index]) {
				if (property_key[0] != '_') {
					if (typeof jsonData[iterator_index][property_key] == "number" && parseInt(jsonData[iterator_index][property_key], 10) === jsonData[iterator_index][property_key]) {
						worksheet.cell(iterator_index + 2, cell_index).number(jsonData[iterator_index][property_key]).style(style).style(style).style({ alignment: { indent: 1 } });
					}
					else if (typeof jsonData[iterator_index][property_key] == "number" && parseInt(jsonData[iterator_index][property_key], 10) !== jsonData[iterator_index][property_key]) {
						worksheet.cell(iterator_index + 2, cell_index).number(jsonData[iterator_index][property_key]).style(style).style({ numberFormat: '#,##0.00; (#,##0.00); -' }).style(style).style({ alignment: { indent: 1 } });
					}
					else {
						worksheet.cell(iterator_index + 2, cell_index).string((jsonData[iterator_index][property_key] == null ? "" : jsonData[iterator_index][property_key]).toString()).style(style).style({ alignment: { indent: 1 } });
					}

					if (header_width_offset[cell_index] < (jsonData[iterator_index][property_key] == null ? "" : jsonData[iterator_index][property_key]).toString().length) {
						worksheet.column(cell_index).setWidth(Math.floor((jsonData[iterator_index][property_key] == null ? "" : jsonData[iterator_index][property_key]).toString().length * 1.4));
						header_width_offset[cell_index] = (jsonData[iterator_index][property_key] == null ? "" : jsonData[iterator_index][property_key]).toString().length;
					}

					cell_index++;
				}
			}

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
			const expiry_time = string_functions.getCurrentTimestampInUnix() + 1800;

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
					responseObject.send({ "viewerUrl": "https://view.officeapps.live.com/op/view.aspx?src=" + appEnv.envConfig.APP_BASE_DOMAIN[0] + "/public/v1/file/" + file_name + "?signature=" + file_access_signature });
				});
			}
		}
		catch (err) {
			appEnv.responseGenerator.sendResponse(responseObject, true, 400, null, JSON.stringify(require('get-current-line').default() || null), "Something went wrong.");
			return;
		}
	},

	writeToExcelFile: function (appEnv, jsonData, callback) {
		try {
			let workbook = createExcelWorkbook(jsonData);

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
	}
};