module.exports = function (app, appEnv) {
	// Routes not to be included in production.
	if (["dev", "staging", "US-QA"].includes(appEnv.appEnvName)) {
		// require('./dev')(app, appEnv);
	}

	require('./client')(app, appEnv);
	require('./document')(app, appEnv);
};
