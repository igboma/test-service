'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash'),
	glob = require('glob')

/**
 * Load app configurations
 */
module.exports = _.extend( {
	app: {
		title: 'nodejs-service-skeleton',
		description: 'The basics to get a RESTful API working.',
		keywords: 'NeDB, Express, Node.js'
	},
	ip: process.env.IP || '127.0.0.1',
	port: process.env.PORT || 9091
});
