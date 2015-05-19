"use strict";
var gcal = require('google-calendar');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var ExternalCalendar = sequelize.define("ExternalCalendar", {
        externalCalendarId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        timeZone: {
            type: DataTypes.STRING
        },
        colorId: {
            type: DataTypes.STRING
        },
        backgroundColor: {
            type: DataTypes.STRING
        },
        foregroundColor: {
            type: DataTypes.STRING
        },
        provider: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function() {
                ExternalCalendar.belongsTo(sequelize.models.Calendar);
            },
            getEvents: function(externalCalendarId, oauthProvider, cb) {
                var that = this;
                var google_calendar = new gcal.GoogleCalendar(oauthProvider.accessToken);
                google_calendar.events.list(externalCalendarId, function(err, calendarList) {
                    if(err) {
                        oauthProvider.getNewToken(function(err, newOauth) {
                            if(err) {
                                return cb(err, null);
                            }

                            google_calendar = new gcal.GoogleCalendar(newOauth.accessToken);
                            google_calendar.events.list(externalCalendarId, function(err, calendarList) {
                                if(err) {
                                    return cb(err, null);
                                }
                                return cb(null, calendarList);
                            })
                        })
                    } else {
                        return cb(null, calendarList);
                    }
                })
            },
            addEvents: function(booking, cb) {
                sequelize.models.Calendar.find({
                    where: {
                        id: booking.CalendarId
                    },
                    include: [{
                            model: sequelize.models.User,
                            include: [sequelize.models.OauthProvider]
                        },
                        sequelize.models.ExternalCalendar
                    ]

                }).then(function(calendar) {
                    // @TODO: Add support for multiple oauth?
                    var oauthProvider = calendar.User.OauthProviders[0];
                    if(!oauthProvider) {
                        cb(new Error('No account has been associated'), null);
                    } else {
                        var exportEvents = function(_oauthProvider, cb) {
                            var google_calendar = new gcal.GoogleCalendar(_oauthProvider.accessToken);
                            google_calendar.events.insert(calendar.ExternalCalendars[0].externalCalendarId, {
                                start: {
                                    dateTime: moment.unix(booking.startTime).format()
                                },
                                end: {
                                    dateTime: moment.unix(booking.endTime).format()
                                },
                                summary: booking.email,
                                description: booking.notes
                            }, function(err, event) {
                                if(err) {
                                    return cb(err, null);
                                } else {
                                    return cb(null, event);
                                }
                            })
                        }
                        if(oauthProvider.isExpired()) {
                            oauthProvider.getNewToken(function(err, oauthProvider) {
                                exportEvents(oauthProvider, cb);
                            })
                        } else {
                            exportEvents(oauthProvider, cb);
                        }
                    }
                }).catch(function(err) {
                    console.log(err);
                    cb(err, null);
                })
            }
        }
    });

    return ExternalCalendar;
};
