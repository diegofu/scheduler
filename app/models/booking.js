"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var Booking = sequelize.define('Booking', {
        startTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        endTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            },
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        classMethods: {
            associate: function() {
                Booking.belongsTo(sequelize.models.Calendar, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    Booking.hook('beforeCreate', function(booking, options) {
        return Booking.findAll({
            where: {
                CalendarId: booking.getDataValue('CalendarId')
            }
        }).then(function(bookings) {
            for(var i = 0; i < bookings.length; i++) {
                if(
                    (booking.getDataValue('startTime') >= bookings[i].startTime && booking.getDataValue('startTime') < bookings[i].endTime) ||
                    (booking.getDataValue('endTime') > bookings[i].startTime && booking.getDataValue('endTime') <= bookings[i].endTime)
                ) {
                    return sequelize.Promise.reject({message: 'The slot is already being booked.'});
                }
            }
            return sequelize.Promise.resolve(booking);
        })
    });

    return Booking;
};