"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var DayOfWeek = sequelize.define("DayOfWeek", {
        dayOfWeek: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 7
            },
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function() {
                DayOfWeek.belongsTo(sequelize.models.Calendar);
                DayOfWeek.hasMany(sequelize.models.Availability, {
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return DayOfWeek;
};