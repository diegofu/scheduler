'use strict';

// User Routes
var users = require('../controllers/users');
var models = require('../models');
var config = require('../../config/config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var calendars = require('../controllers/calendars');
var externalCalendars = require('../controllers/externalCalendars');
var gcal = require('google-calendar');
var refresh = require('google-refresh-token');
var googleAuth = require('../../config/strategies/google');

module.exports = function(app) {
    app.route('/users/me').get(users.me);
    app.route('/users/signin').post(users.signin);
    app.route('/users').post(users.signup);
    app.route('/users/logout').get(users.logout);

    app.route('/session/login').post(users.signin);
    app.route('/session').get(users.me);

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        models.User.findOne({
            where: {
                id: id
            },
            include: [
                models.OauthProvider
            ]
        }).then(function(user) {
            done(null, user);
        }).catch(function(err) {
            done(err, null)
        });
    });

    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar'
        ],
        accessType: 'offline',
        // approvalPrompt: 'force' // remove this after db is stable
    }));

    app.get('/auth/google/callback', users.oauthCallback('google'));

    app.route('/externalCalendars/:calendarId/:externalCalendarId?')
        .get(users.requiresLogin, externalCalendars.findAll)
        .post(users.requiresLogin, calendars.hasAuthorization, externalCalendars.create)
        .delete(users.requiresLogin, externalCalendars.getCalendar, calendars.hasAuthorization, externalCalendars.delete);

    app.route('/externalCalendars/getExisting/:calendarId')
        .get(users.requiresLogin, calendars.hasAuthorization, externalCalendars.getExisting);

    app.param('calendarId', calendars.calendarByID);
};
