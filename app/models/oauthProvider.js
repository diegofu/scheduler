"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var OauthProvider = sequelize.define('OauthProvider', {
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresIn: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tokenType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provider: {
            type: DataTypes.ENUM('google', 'facebook'),
            allowNull: false
        },
        providerUniqueId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING,
        },
        idToken: {
            type: DataTypes.TEXT
        }
    }, {
        classMethods: {
            associate: function(models) {
                OauthProvider.belongsTo(models.User);
            }
        }
    });

    return OauthProvider;
};