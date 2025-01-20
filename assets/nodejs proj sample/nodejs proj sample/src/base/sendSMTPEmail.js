// @author: Manish Jain
// Created on: 2019-06-14 1:05 PM
// Description: Function to send emails.
"use strict";

let smtp_credentials = [];

try {
	let temp_smtp_server_confg = [];

	for (let itr1 = 0; itr1 < 10; itr1++) {

		if (process.env.hasOwnProperty("MG_SMTP_HOST_" + itr1) && process.env.hasOwnProperty("MG_SMTP_USER_" + itr1) && process.env.hasOwnProperty("MG_SMTP_PASS_" + itr1) && process.env.hasOwnProperty("MG_SMTP_PORT_" + itr1) && process.env.hasOwnProperty("MG_SMTP_SENDER_EMAIL_" + itr1) && process.env.hasOwnProperty("MG_SMTP_SENDER_ALIAS_" + itr1)) {

			let temp_smtp_server_object = {};

			temp_smtp_server_object["SMTP_HOST"] = process.env["MG_SMTP_HOST_" + itr1];
			temp_smtp_server_object["SMTP_USERNAME"] = process.env["MG_SMTP_USER_" + itr1];
			temp_smtp_server_object["SMTP_PASSWORD"] = process.env["MG_SMTP_PASS_" + itr1];
			temp_smtp_server_object["SMTP_PORT"] = parseInt(process.env["MG_SMTP_PORT_" + itr1]);
			temp_smtp_server_object["SMTP_SENDER_EMAIL"] = process.env["MG_SMTP_SENDER_EMAIL_" + itr1];
			temp_smtp_server_object["SMTP_SENDER_ALIAS"] = process.env["MG_SMTP_SENDER_ALIAS_" + itr1];

			temp_smtp_server_confg.push(temp_smtp_server_object);
		}
		else {

			break;
		}
	}

	if (temp_smtp_server_confg.length > 0) {

		smtp_credentials = JSON.parse(JSON.stringify(temp_smtp_server_confg));
	}
	else {

		const fs = require('fs');
		const YAML = require('yaml');

		const smtp_config_file = fs.readFileSync('./server_config/smtp_config.yaml', 'utf8');
		smtp_credentials = YAML.parse(smtp_config_file)["smtp_credentials"];

		// const smtpConfig = require('../../server_config/smtp_config');
		// smtp_credentials = smtpConfig.getSMTPConfig();
	}
}
catch (e) {

	console.log("SMTP config missing.");
	console.error(e);
	throw Error("SMTP config missing.");
}

let sendEmail = function (configIndex, senderList, emailSubject, emailTemplate, templateParams, attachments, callback) {
	try {
		let fs = require('fs');
		let path = require('path');
		let filePath = path.join(__dirname, "../../email_templates/" + emailTemplate + ".html");

		fs.readFile(filePath, 'utf8', function (err, data) {
			try {
				if (!err || data != "") {

					// let Mustache = require('mustache');
					let Handlebars = require('handlebars');

					Handlebars.registerHelper("inc", function (value, options) {
						return parseInt(value) + 1;
					});

					Handlebars.registerHelper('checklength', function (v1, v2, options) {
						if (v1.length > v2) {
							return true;
						}
						return false;
					});

					// let template_data = Mustache.render(data, templateParams);

					let template = Handlebars.compile(data);

					let template_data = template(templateParams);

					// let attachment_data = [ { "data": template_data, "alternative": true } ];
					let attachment_data = [];

					try {

						for (let itr1 = 0; itr1 < attachments.length; itr1++) {

							attachment_data.push(attachments[itr1]);
						}
					}
					catch (err) { }

					let message = {
						// text:	"i hope this works", 
						from: smtp_credentials[configIndex].SMTP_SENDER_ALIAS + " " + smtp_credentials[configIndex].SMTP_SENDER_EMAIL,
						to: senderList.join(','),
						subject: emailSubject,
						html: template_data,
						attachment: attachment_data
						// attachment: 
						// [
						// 	{ "data": template_data, "alternative": true },
						// 	{ path:"path/to/file.zip", type:"application/zip", name:"renamed.zip" }
						// ]
					};

					// let email = require("emailjs");
					// let server = email.server.connect({
					// 	user: smtp_credentials[configIndex].SMTP_USERNAME,
					// 	password: smtp_credentials[configIndex].SMTP_PASSWORD,
					// 	host: smtp_credentials[configIndex].SMTP_HOST,
					// 	port: smtp_credentials[configIndex].SMTP_PORT,
					// 	ssl: false
					// });

					// server.sendMail(message, function (err, message) {
					// 	callback(err);
					// });

					const nodemailer = require("nodemailer");

					const transporter = nodemailer.createTransport({
						host: smtp_credentials[configIndex].SMTP_HOST,
						port: smtp_credentials[configIndex].SMTP_PORT,
						secure: false, // Use `true` for port 465, `false` for all other ports
						auth: {
							user: smtp_credentials[configIndex].SMTP_USERNAME,
							pass: smtp_credentials[configIndex].SMTP_PASSWORD,
						},
						tls: {
							rejectUnauthorized: false
						}
					});

					transporter.sendMail(message, function (err, message) {

						callback(err);
					});
				}
				else {

					callback(err);
				}
			}
			catch (err) {

				callback(err);
			}
		});
	}
	catch (err) {

		callback(err);
	}
};

module.exports = {
	sendEmail: sendEmail,
};