'use strict';

module.exports = function(app) {
	// User Routes
	var users = require('../controllers/users');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users/signin').post(users.signin);
	app.route('/users').post(users.signup);

	app.route('/session/login').post(users.signin);
	app.route('/session').get(users.me);
};
