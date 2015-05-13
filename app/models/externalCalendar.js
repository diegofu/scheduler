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
            }
        }
    });

    return ExternalCalendar;
};
