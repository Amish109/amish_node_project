// @author: Manish Jain
// Created on: 2017-11-01 05:58 PM
// Description: String utility functions.

// @editor: Manish Jain
// Updated on: 2018-05-21 11:30 AM
// Description: Added unixToUtc function

// Modified by: Manish Jain
// On: 2022-01-18 14:45
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2021-12-24 18:00
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

let unixTimeToString = function (unixTimeStamp) {
	return dateTimeToString(new Date(unixTimeStamp * 1000));
};

let unixToUtc = function (unixTimeStamp, strTimezone) {
	let inputUnixTimeStamp = unixTimeStamp;

	try {
		let hours = Math.floor(parseInt(strTimezone.substring(4, 8)) / 100);
		let mins = parseInt((strTimezone).substring(4, 8)) - hours * 100;
		let seconds = hours * 3600 + mins * 60;
		(strTimezone.substring(3, 4) == '-') ? unixTimeStamp = unixTimeStamp + seconds : unixTimeStamp = unixTimeStamp - seconds;
	}
	catch (e) {
		unixTimeStamp = inputUnixTimeStamp;
	}
	return unixTimeStamp;
};

let unixToUtcReverse = function (unixTimeStamp, strTimezone) {
	let inputUnixTimeStamp = unixTimeStamp;
	try {
		let hours = Math.floor(parseInt(strTimezone.substring(4, 8)) / 100);
		let mins = parseInt((strTimezone).substring(4, 8)) - hours * 100;
		let seconds = hours * 3600 + mins * 60;
		(strTimezone.substring(3, 4) == '-') ? unixTimeStamp = unixTimeStamp - seconds : unixTimeStamp = unixTimeStamp + seconds;
	}
	catch (e) {
		unixTimeStamp = inputUnixTimeStamp;
	}
	return unixTimeStamp;
};

let unixToUtcString = function (unixTimeStamp) {
	return unixTimeToString(unixTimeStamp + (new Date(unixTimeStamp)).getTimezoneOffset() * 60);
};

let getCurrentTimestampInUnix = function () {
	let currentdate = new Date();

	return stringToUnixTime(dateTimeToStringUTC(dateTimeToString(currentdate)));
};

let dateStringToDDMMYYYY = function (dateTime) {
	let returnStrDate = "";
	dateTime = new Date(dateTime * 1000);
	try {
		const monthNames = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		returnStrDate = dateTime.getDate() + " " + monthNames[dateTime.getMonth()] + " " + dateTime.getFullYear();
	}
	catch (e) {
		return ("");
	}
	return returnStrDate; // will return "1 Jan 2018"
};

let dateTimeToHourAmPm = function (dateTime) {
	let returnStrDate = "";
	dateTime = new Date(dateTime * 1000);

	const monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	try {
		let hourHolder = (parseInt(dateTime.getHours()) > 12) ? (parseInt(dateTime.getHours()) - 12) : parseInt(dateTime.getHours());
		hourHolder = (hourHolder == 0) ? 12 : hourHolder;
		let timeSlot = (parseInt(dateTime.getHours()) >= 12) ? " PM" : " AM";
		returnStrDate = dateTime.getDate() + " " + monthNames[dateTime.getMonth()] + " " + dateTime.getFullYear() + "|" + hourHolder + ":" + zfill(dateTime.getMinutes(), 2) + timeSlot;
	}
	catch (e) {
		return ("");
	}
	return returnStrDate; // will return "1 Jan 2018|6:30 AM"
};

module.exports = {
	unixTimeToString: unixTimeToString,
	unixToUtc: unixToUtc,
	unixToUtcReverse: unixToUtcReverse,
	unixToUtcString: unixToUtcString,
	getCurrentTimestampInUnix: getCurrentTimestampInUnix,
	dateStringToDDMMYYYY: dateStringToDDMMYYYY,
	dateTimeToHourAmPm: dateTimeToHourAmPm
};