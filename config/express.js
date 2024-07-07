'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const compress = require('compression');
const methodOverride = require('method-override');
const config = require('./config');
const router = express.Router();

const { metricsMiddleware, register } = require('../app/middlewares/metrics.middleware');

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

	// Use the metrics middleware
	app.use(metricsMiddleware);

	// Routes definition
	router.use('/api/v1', require('../app/routes/message.server.routes'));

	// Metrics endpoint

	router.get('/', async (req, res) => {
		res.status(200).send('<html><body><h1>Welcome to Palindrome service</h1></body></html>');
	});
	router.get('/metrics', async (req, res) => {
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	});

	router.get('/health', async (req, res) => {
		res.status(200).json({ status: 'UP' });
	});

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
			message: 'The requested endpoint does not exist or is not implemented.'
		});
	});

	// Return Express server instance
	return app;
};
