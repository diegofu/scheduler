"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var Calendar = sequelize.define("Calendar", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: false
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
            associate: function(models) {
                Calendar.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
                Calendar.hasMany(models.Availability);
            },
            createCalendar: function(calendar, user) {
                return sequelize.transaction(function(t) {
                    var _calendar = Calendar.build(calendar);
                    _calendar.setUser(user, {
                        save: false
                    });

                    return _calendar.save({
                        transaction: t
                    }).then(function() {
                        return sequelize.Promise.all(sequelize.Promise.map(calendar.Availabilities, function(a) {
                            var availability = sequelize.models.Availability.build(a);
                            availability.setCalendar(_calendar, {
                                save: false
                            });
                            return availability.save({
                                transaction: t
                            }).catch(function(err) {
                                throw new Error(err);
                            });
                        }));
                    }).catch(function(err) {
                        throw new Error(err);
                    });
                });
            }
        }
    }, {
        instanceMethods: {}
    });

    return Calendar;
};
