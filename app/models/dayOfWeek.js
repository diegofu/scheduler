"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var DayOfWeek = sequelize.define("DayOfWeek", {
        dayOfWeek: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 6
            },
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function() {
                DayOfWeek.belongsTo(sequelize.models.Calendar, {
                    onDelete: 'CASCADE'
                });
                DayOfWeek.hasMany(sequelize.models.Availability, {
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return DayOfWeek;
};