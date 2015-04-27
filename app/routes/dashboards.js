'use strict';

var models = require('../models'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var gcal = require('google-calendar');

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


    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/calendar'
        ]
    }));
    // app.route('/auth/google/callback').get(function(strategy) {
    //     passport.authenticate('google', { failureRedirect: '/login' }),
    //         function(req, res) {
    //             console.log(req);
    //         });
    // });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.access_token = req.user.accessToken;
    // console.log(req);
    res.redirect('/');
  });

    passport.use(new GoogleStrategy({
            clientID: '188872170464-q44fr43ptithd868f76g0d3jkbq0r7up.apps.googleusercontent.com',
            clientSecret: 'ExWGEoFy7bPG81IV7FiFJVcC',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function(accessToken, refreshToken, params, profile, done) {
            process.nextTick(function() {
                console.log(params);
                profile.accessToken = accessToken;
                return done(null, profile);
            })
        }
    ));

    app.get('/gcalendars/list', function(req, res) {
        console.log(req.session.access_token);
    })
};
