"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var Calendar = sequelize.define("Calendar", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT
        },
        defaultLength: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minLength: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxLength: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function() {
                Calendar.belongsTo(sequelize.models.User);
                Calendar.hasMany(sequelize.models.DayOfWeek, {
                    onDelete: 'CASCADE'
                });
                Calendar.hasMany(sequelize.models.Booking, {
                    onDelete: 'CASCADE'
                });
                Calendar.hasMany(sequelize.models.ExternalCalendar, {
                    onDelete: 'CASCADE'
                });
            },
            createCalendar: function(calendarData, user) {
                return sequelize.transaction(function(t) {
                    var calendar = Calendar.build(calendarData);
                    calendar.setUser(user, {
                        save: false
                    });
                    return calendar.save({
                        transaction: t
                    }).then(function(_calendar) {
                        return sequelize.Promise.all(sequelize.Promise.map(
                            calendarData.DayOfWeek, function(d) {
                                var day = sequelize.models.DayOfWeek.build(d);
                                day.setCalendar(_calendar, {
                                    save: false
                                });

                                return day.save({
                                    transaction: t
                                }).then(function(_day) {
                                    return sequelize.Promise.all(sequelize.Promise.map(
                                        d.Availabilities, function(a) {
                                            var availability = sequelize.models.Availability.build(a);
                                            availability.setDayOfWeek(_day, {
                                                save: false
                                            });
                                            return availability.save({
                                                transaction: t
                                            });
                                        }
                                    ))
                                }).catch(function(err) {
                                    throw new Error(err);
                                });
                            }
                        ));
                    }).catch(function(err) {
                        throw new Error(err);
                    });
                });
            }
        }
    });

    return Calendar;
};
