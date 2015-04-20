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
        defaultLength : {
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
                Calendar.belongsTo(models.User);
                Calendar.hasMany(models.Availability);
            }
        }
    }, {
        instanceMethods: {}
    });

    return Calendar;
};
