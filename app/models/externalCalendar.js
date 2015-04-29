"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var ExternalCalendar = sequelize.define("ExternalCalendar", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        externalCalendarId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provider: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {
                ExternalCalendar.belongsTo(models.Calendar, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return ExternalCalendar;
};
