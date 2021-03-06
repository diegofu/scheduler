'use strict';

var dashboard = require('../controllers/dashboards');
var calendars = require('../controllers/calendars');
var users = require('../controllers/users');
var bookings = require('../controllers/bookings');
var models = require('../models');

// Everything in here should be secured
module.exports = function(app) {
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


    app.route('/calendars/:calendarId/availableSlot/:availableSlotId?')
        .put(users.requiresLogin, calendars.hasAuthorization, function(req, res) {
            models.Availability.upsert(req.body).then(function(availableSlot) {
                res.json(availableSlot);
            }).catch(function(err) {
                res.status(500).json(err);
            })
        })
        .post(users.requiresLogin, calendars.hasAuthorization, function(req, res) {
            models.DayOfWeek.find({
                where: {
                    CalendarId: req.calendar.id
                }
            }).then(function(dayOfWeek) {
                var availableSlot = models.Availability.build(req.body);
                availableSlot.set('DayOfWeekId', dayOfWeek.id);

                availableSlot.save().then(function(availableSlot) {
                    res.json(availableSlot);
                })
            }).catch(function(err) {
                res.status(500).json(err);
            })
        })

    app.route('/calendars/all/:id').get(calendars.all);
};
