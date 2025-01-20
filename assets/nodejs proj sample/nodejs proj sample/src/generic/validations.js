// Modified by: Manish Jain
// On: 2022-01-18 15:45
// Reason: function syntax generalization

// Modified by: Manish Jain
// On: 2023-12-24 18:40
// Reason: Migrating from ECMA5 to ECMA6.
"use strict";

const domainLookupType = "MX";

let toTitleCase = function (str) {
	str = str.toLowerCase().split(' ');
	for (let i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

/* function will validate email adress exists or not */
let isEmailValid = function (emailAddress) {
	emailAddress = emailAddress.trim();
	email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return email_regex.test(emailAddress);
};

let isDomainExists = function (domainName, fn) { // can be used got validating MX record of emails
	dns = require("dns");
	dns.resolve(domainName, domainLookupType, fn);
};

let isMobileNumberValid = function (number) {
	if (number.length < 10 || number.length > 10) {
		return false;
	}
	let start_of_no = number.slice(0, 2);
	if (start_of_no < 70 || start_of_no > 99) {
		return false;
	}

	return true;
};

module.exports = {
	toTitleCase: toTitleCase,
	isEmailValid: isEmailValid,
	isDomainExists: isDomainExists,
	isMobileNumberValid: isMobileNumberValid
};