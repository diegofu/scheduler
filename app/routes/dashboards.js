'use strict';


// Everything in here should be secured
module.exports = function(app) {
    var dashboard = require('../controllers/dashboards');
    var calendars = require('../controllers/calendars');
    var users = require('../controllers/users');
    var bookings = require('../controllers/bookings');
    var models = require('../models');


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

    app.route('/calendars/:calendarId/availabilities')
        .get(users.redirectLogin, calendars.hasAuthorization, calendars.availabilities)

    app.route('/bookings')
        .get(users.requiresLogin, bookings.list)
        .post(bookings.create);

    app.route('/bookings/:bookingId')
        .put(bookings.create);


    app.route('/calendars/:calendarId/availableSlot/:availableSlotId')
        .put(users.requiresLogin, calendars.hasAuthorization, function(req, res) {
            models.Availability.upsert(req.body).then(function(availableSlot) {
                res.json(availableSlot);
            }).catch(function(err) {
                res.status(500).json(err);
            })
        })
};
