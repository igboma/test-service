'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash');
/**
 * Load app configurations
 */
module.exports = _.extend({
	app: {
		title: process.env.APP_TTILE || 'nodejs-service-skeleton',
		description: process.env.APP_DESCRIPTION || 'The basics to get a RESTful API working.',
		keywords: process.env.APP_KEYWORD || 'NeDB, Express, Node.js'
	},
	port: process.env.PORT || 4000
});
