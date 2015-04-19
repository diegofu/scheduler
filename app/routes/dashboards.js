'use strict';

var models  = require('../models');

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
    	.get(calendars.list);

    app.route('/calendars/:calendarId')
    	.get(calendars.read)
    	.put(calendars.update)
    	.delete(calendars.delete);

    app.param('calendarId', calendars.calendarByID);
};
