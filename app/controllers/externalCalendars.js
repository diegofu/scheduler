'user strict';

var models = require('../models');
var gcal = require('google-calendar');
var config = require('../../config/config');
var refresh = require('google-refresh-token');
var _ = require('lodash');

exports.findAll = function(req, res) {
    models.OauthProvider.findAll({
        include: [{
            model: models.User,
            where: {
                id: req.user.id
            }
        }]
    }).then(function(oauthProvider) {
        if (oauthProvider.length) {
            // @TODO: add multiple provider support
            var google_calendar = new gcal.GoogleCalendar(oauthProvider[0].accessToken);
            google_calendar.calendarList.list({
                minAccessRole: 'writer'
            }, function(err, calendarList) {
                if (err) {
                    refresh(oauthProvider[0].refreshToken, config.google.clientID, config.google.clientSecret, function(err, json, response) {
                        if (err) {
                            return handleError(err);
                        }
                        if (json.error) {
                            return handleError(new Error(response.statusCode + ': ' + json.error));
                        }

                        var newAccessToken = json.accessToken;
                        if (!newAccessToken) {
                            return handleError(new Error(response.statusCode + ': refreshToken error'));
                        }
                        var expireAt = new Date(+new Date + parseInt(json.expiresIn, 10));
                        oauthProvider[0].setDataValue('accessToken', newAccessToken);
                        oauthProvider[0].save().then(function() {
                            res.redirect('/externalCalendars/' + req.calendar.id);
                        });
                    });
                } else {
                    // @TODO: When there are too many google calendars
                    models.ExternalCalendar.findAll({
                        where: {
                            CalendarId: req.calendar.id
                        }
                    }).then(function(existingCalendars) {

                        calendarList.items.forEach(function(item) {
                            item.externalCalendarId = item.id;
                            item.provider = 'google';
                            delete item.id;

                            var exists = _.findWhere(existingCalendars, {externalCalendarId: item.externalCalendarId});
                            if(exists) {
                                item.id = exists.id
                            }
                        });

                        res.json(calendarList.items);
                    }).catch(function(err) {
                        res.status(500).json(err);
                    });
                }
            });
        } else {
            // TODO: Redirect user to add a provider page
            res.json('This should never happen!');
        }
    })
}

exports.create = function(req, res) {
    models.ExternalCalendar.build(req.body).save().then(function(externalCalendar) {
        res.json(externalCalendar);
    }).catch(function(err) {
        res.status(500).json(err);
    })
}

exports.delete = function(req, res) {
    models.ExternalCalendar.destroy({
        where: {
            id: req.params.externalCalendarId
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.status(500).json(err);
    })
}

exports.getCalendar = function(req, res, next) {
    models.ExternalCalendar.find({
        include: [models.Calendar],
        where: {
            id: req.params.externalCalendarId
        }
    }).then(function(externalCalendar) {
        req.calendar = externalCalendar.Calendar
        next()
    })
}

exports.getExisting = function(req, res, next) {
    models.ExternalCalendar.findAll({
        where: {
            CalendarId: req.calendar.id
        }
    }).then(function(externalCalendars) {
        res.json(externalCalendars);
    }).catch(function(err) {
        res.status(500).json(err);
    })
}