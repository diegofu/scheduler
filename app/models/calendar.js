"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var Calendar = sequelize.define("Calendar", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT
        },
        defaultLength: {
            type: DataTypes.INTEGER
        },
        minLength: {
            type: DataTypes.INTEGER
        },
        maxLength: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function(models) {
                Calendar.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
                Calendar.hasMany(models.Availability);
            },
            createCalendar: function(models, calendar, user) {
                return sequelize.transaction(function(t) {
                    var _calendar = Calendar.build(calendar);
                    _calendar.setUser(user, {
                        save: false
                    });
                    return _calendar.save({
                        transaction: t
                    }).then(function() {
                        return sequelize.Promise.all(sequelize.Promise.map(calendar.Availabilities, function(a) {
                            var availability = models.Availability.build(a);
                            availability.setCalendar(_calendar, {
                                save: false
                            });
                            return availability.save({
                                transaction: t
                            });
                        }));
                    }).catch(function(err) {
                        return err;
                    });
                });
            }
        }
    }, {
        instanceMethods: {}
    });

    return Calendar;
};
