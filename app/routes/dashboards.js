'use strict';

var models  = require('../models');

// Everything in here should be secured
module.exports = function(app) {
	var dashboard = require('../controllers/dashboards');
	var calendars = require('../controllers/calendars');
	var users = require('../controllers/users');
    var bookings = require('../controllers/bookings');

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
    	.put(users.requiresLogin, calendars.hasAuthorization, calendars.update)
    	.delete(users.requiresLogin, calendars.hasAuthorization, calendars.delete);

    app.param('calendarId', calendars.calendarByID);

    app.route('/bookings')
        .get(bookings.create)
        .post(bookings.create);

    app.route('/bookings/:bookingId')
        .put(bookings.create);
};
