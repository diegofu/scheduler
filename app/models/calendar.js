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
        }
    }, {
        classMethods: {
            associate: function(models) {
                Calendar.belongsTo(models.User);
            }
        }
    }, {
        instanceMethods: {}
    });

    return Calendar;
};