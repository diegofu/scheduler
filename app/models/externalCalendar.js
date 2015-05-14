"use strict";
var gcal = require('google-calendar');

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
            associate: function(models) {
                ExternalCalendar.belongsTo(models.Calendar);
            },
            addEvents: function(calendarId, accessToken, cb) {
                var google_calendar = new gcal.GoogleCalendar(accessToken);
                google_calendar.events.list(calendarId, function(err, calendarList) {
                    if(err) {

                    }
                    return cb(err, calendarList);
                })
            },
            getEvents: function(calendarId, oauthProvider, cb) {
                var that = this;
                var google_calendar = new gcal.GoogleCalendar(oauthProvider.accessToken);
                google_calendar.events.list(calendarId, function(err, calendarList) {
                    if(err) {
                        oauthProvider.getNewToken(function(err, newOauth) {
                            if(err) {
                                return cb(err, null);
                            }

                            google_calendar = new gcal.GoogleCalendar(newOauth.accessToken);
                            google_calendar.events.list(calendarId, function(err, calendarList) {
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
            }
        }
    });

    return ExternalCalendar;
};
