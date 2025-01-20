"use strict";

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

// Creating app environment variable.
const appEnv = require('./src/base/appEnvironmentBuilder').getAppEnvironment(__dirname, "reporting");

app.use('/static', express.static(appEnv.appPath + '/static'));

app.use(express.static('/uploads'));
let path = require('path');

app.use('/uploads', express.static(appEnv.appPath + '/uploads'));

app.use(function (req, res, next) {

	let custHeadr = require(appEnv.appPath + '/src/base/customHeaders');

	res.header('Access-Control-Allow-Origin', custHeadr.getAllowedOrigin(req.headers, appEnv.envConfig.ALLOWED_ORIGIN));
	res.header('Access-Control-Allow-Headers', custHeadr.getAllowedHeaders(req.headers, appEnv.envConfig.ALLOWED_HEADERS));
	res.header('Access-Control-Allow-Methods', custHeadr.getAllowedMethods(req.headers, appEnv.envConfig.ALLOWED_METHODS));
	res.header('Access-Control-Allow-Credentials', true);

	// res.header('Content-Type', 'application/json; charset=UTF-8');
	res.header('x-content-type-options', 'nosniff');
	res.header('X-XSS-Protection', '1; mode=block');
	res.header('x-frame-options', 'sameorigin');
	res.header('cache-control', 'no-cache, no-store, max-age=0, must-revalidate');
	res.header("Content-Security-Policy", "default-src 'self' 'unsafe-inline' *.google.com; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
	// res.header("Content-Security-Policy", "default-src 'self' 'unsafe-inline' *.google.com; script-src 'self' 'unsafe-inline' https://*.google.com; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
	// res.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.google.com; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");

	// New headers agged in 2023.6.0
	res.header('Permissions-Policy', '*');
	res.header('Referrer-Policy', 'origin-when-cross-origin');
	res.header('X-Permitted-Cross-Domain-Policies', 'none');
	res.header('X-Content-Type-Options', 'nosniff');

	return next();
});

// Import Routers.
require(appEnv.appPath + '/router')(app, appEnv);

let port = 5555;

// Bypass SSL for Local environment.
if (appEnv.envConfig.SSL_CERTIFICATE.key_path == "" || appEnv.envConfig.SSL_CERTIFICATE.cert_path == "") {

	let server = app.listen(port, function () {

		console.log("Express is expressing on " + port + " without SSL @ " + new Date(Date.now()));
	});
}
else {
	// Start HTTPS server
	let https = require('https');
	let fs = require('fs');
	let options = {

		key: fs.readFileSync(appEnv.envConfig.SSL_CERTIFICATE.key_path),
		cert: fs.readFileSync(appEnv.envConfig.SSL_CERTIFICATE.cert_path)
	};

	let server = https.createServer(options, app).listen(port, function () {

		console.log("Express is expressing on " + port + " @ " + new Date(Date.now()));
	});
}