'use strict';

var models  = require('../models');

// Everything in here should be secured
module.exports = function(app) {
	var dashboard = require('../controllers/dashboards');
	var calendars = require('../controllers/calendars');
	var users = require('../controllers/users');
    app.route('/dashboard').get(users.redirectLogin, function(req, res) {
        res.render('dashboard', {
            title: 'My Dashboard'
        });
    });
    app.route('/calendars')
    	.post(users.requiresLogin, calendars.create)
    	.get(users.redirectLogin, calendars.list);

    app.route('/calendars/:calendarId')
    	.get(calendars.read)
    	.put(users.requiresLogin, calendars.update)
    	.delete(users.requiresLogin, calendars.delete);

    app.param('calendarId', calendars.calendarByID);
};
