'use strict';

var models = require('../models'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy = require('passport-local').Strategy;

var gcal = require('google-calendar');


// Everything in here should be secured
module.exports = function(app) {
    var dashboard = require('../controllers/dashboards');
    var calendars = require('../controllers/calendars');
    var users = require('../controllers/users');
    var bookings = require('../controllers/bookings');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        models.User.findOne({
            where: {
                id: id
            }
        }).success(function(user) {
            done(null, user);
        }).error(function(err){
            done(err, null)
        });
    });

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
        .get(users.requiresLogin, bookings.list)
        .post(bookings.create);

    app.route('/bookings/:bookingId')
        .put(bookings.create);


    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar'
        ],
        accessType: 'offline', approvalPrompt: 'force'
    }));

    app.get('/auth/google/callback',
        function(req, res, next) {
            passport.authenticate('google', function(err, user, redirectUrl) {
                if(err || !user) {
                    return res.redirect('/#/signup');
                }

                req.login(user, function(err) {
                    if(err) {
                        console.log(err);
                        return res.redirect('/#!/signin');
                    }

                    return res.redirect(redirectURL || '/dashboard');
                })
            }) (req, res, next);
        }
    );

    passport.use(new GoogleStrategy({
            clientID: '188872170464-q44fr43ptithd868f76g0d3jkbq0r7up.apps.googleusercontent.com',
            clientSecret: 'ExWGEoFy7bPG81IV7FiFJVcC',
            callbackURL: 'http://localhost:3000/auth/google/callback',
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

    app.get('/gcalendars/list', function(req, res) {
        if(!req.user.accessToken) {
            return res.redirect('/auth/google');
        }
        var google_calendar = new gcal.GoogleCalendar(req.user.accessToken);
        google_calendar.calendarList.list({
            minAccessRole: 'writer'
        },function(err, calendarList) {
            console.log(err);
            console.log(calendarList);
        });
    })


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
};
