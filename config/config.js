'use strict';
var env = process.env.NODE_ENV || 'development';
var _ = require('lodash');
console.log(env);
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + env)
);