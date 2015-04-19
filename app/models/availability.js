"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var Availability = sequelize.define("Availability", {
        dayOfWeek: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 7
            }
        },
        startTime: {
            type: DataTypes.STRING,
            validate: {
                timeOfDay: function(value) {
                    var re = new RegExp(/([01][0-9]|2[0-3])[0-5][0-9]/);
                    if(!re.test(value)) {
                        throw new Error('Invalid time');
                    }
                }
            }
        },
        endTime: {
            type: DataTypes.STRING,
            validate: {
                timeOfDay: function(value) {
                    var re = new RegExp(/([01][0-9]|2[0-3])[0-5][0-9]/);
                    if(!re.test(value)) {
                        throw new Error('Invalid time');
                    }
                }
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                Availability.belongsTo(models.Calendar);
            }
        }
    }, {
        instanceMethods: {}
    });

    return Availability;
};