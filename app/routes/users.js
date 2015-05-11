'use strict';


// User Routes
var users = require('../controllers/users');
var models = require('../models'),
    passport = require('passport'),
    config = require('../../config/config'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy = require('passport-local').Strategy;
var calendars = require('../controllers/calendars');
var externalCalendars = require('../controllers/externalCalendars');

var gcal = require('google-calendar'),
    refresh = require('google-refresh-token');

module.exports = function(app) {

    // Setting up the users profile api
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

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            models.User.findOne({
                where: {
                    email: email
                },
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }

                return done(null, user);
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, params, profile, done) {
            var user = {
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile.emails[0].value,
                provider: profile.provider,
                oauthProvider: {
                    providerUniqueId: profile.id,
                    displayName: profile.displayName,
                    provider: profile.provider,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    tokenType: params.token_type,
                    idToken: params.id_token,
                    expiresIn: params.expires_in
                }
            };

            users.saveOAuthUserProfile(req, user, done);
        }
    ));

    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar'
        ],
        accessType: 'offline',
        approvalPrompt: 'force' // remove this after db is stable
    }));

    app.get('/auth/google/callback',
        function(req, res, next) {
            passport.authenticate('google', function(err, user, redirectUrl) {
                if (err || !user) {
                    return res.redirect('/#/signup');
                }
                req.login(user, function(err) {
                    if (err) {
                        return res.redirect('/#!/signin');
                    }
                    return res.redirect('/dashboard');
                })
            })(req, res, next);
        }
    );

    app.route('/externalCalendars/:calendarId/:externalCalendarId?')
        .get(users.requiresLogin, externalCalendars.findAll)
        .post(users.requiresLogin, calendars.hasAuthorization, externalCalendars.create)
        .delete(users.requiresLogin, externalCalendars.getCalendar, calendars.hasAuthorization, externalCalendars.delete);

    app.route('/externalCalendars/getExisting/:calendarId')
        .get(users.requiresLogin, calendars.hasAuthorization, externalCalendars.getExisting);

    app.param('calendarId', calendars.calendarByID);
};
