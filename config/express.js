'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const compress = require('compression');
const methodOverride = require('method-override');
const config = require('./config');
const router = express.Router();

module.exports = function () {
	// Initialize express app
	const app = express();

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;

	// Passing the request url to environment locals
	app.use(function (req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	app.use(compress({
		filter: function (req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Environment dependent middleware
	app.locals.cache = 'memory';

	app.use(express.json());
	app.use(methodOverride());

	// Routes definition
	router.use('/api/v1', require('../app/routes/message.server.routes'));
	router.use('/', require('../app/routes/home.server.routes')); // Include the new routes here

	app.use(router);

	// Assume 'not found' in the error msgs is a 404.
	app.use(function (err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(404).json({ message: 'Endpoint not found.' });
	});

	// Assume 501 since no middleware responded
	app.use(function (req, res) {
		res.status(501).send({
			message: 'The requested endpoint does not exists or is not implemented.'
		});
	});

	// Return Express server instance
	return app;
};
