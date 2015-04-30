"use strict";
var crypto = require('crypto');


// test
module.exports = function(sequelize, DataTypes) {
    var Availability = sequelize.define("Availability", {
        startTime: {
            type: DataTypes.STRING,
            validate: {
                timeOfDay: function(value) {
                    var re = new RegExp(/([01]?[0-9]|2[0-3]):[0-5][0-9]/);
                    if(!re.test(value)) {
                        throw new Error('Invalid time');
                    }
                }
            },
            allowNull: false
        },
        endTime: {
            type: DataTypes.STRING,
            validate: {
                timeOfDay: function(value) {
                    var re = new RegExp(/([01]?[0-9]|2[0-3]):[0-5][0-9]/);
                    if(!re.test(value)) {
                        throw new Error('Invalid time');
                    }
                }
            },
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function() {
                Availability.belongsTo(sequelize.models.DayOfWeek, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return Availability;
};