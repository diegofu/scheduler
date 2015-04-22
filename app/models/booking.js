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
            associate: function(models) {
                Booking.belongsTo(models.Calendar, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
            }
        }
    }, {
        instanceMethods: {}
    });

    return Booking;
};