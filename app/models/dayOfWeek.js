"use strict";
var crypto = require('crypto');


// test
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
                DayOfWeek.belongsTo(sequelize.models.Calendar, {
                    foreignKey: {
                        allowNull: false,
                    },
                    onDelete: 'CASCADE'
                });
            }
        }
    });

    return DayOfWeek;
};