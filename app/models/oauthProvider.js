"use strict";
var crypto = require('crypto');
var refresh = require('google-refresh-token');
var config = require('../../config/config');
var moment = require('moment');

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
        },
        instanceMethods: {
            getNewToken: function(cb) {
                var that = this;
                refresh(this.refreshToken, config.google.clientID, config.google.clientSecret, function(err, body, res) {
                    if (err) {
                        return cb(err, null);
                    }

                    if (parseInt(res.statusCode / 100, 10) !== 2) {
                        if (body.error) {
                            return cb(new Error(res.statusCode + ': ' + (body.error.message || body.error)), null);
                        }
                        if (!body.access_token) {
                            return cb(new Error(res.statusCode + ': refreshToken error'), null);
                        }
                    }

                    var newAccessToken = body.accessToken;
                    var expireAt = new Date(+new Date + parseInt(body.expiresIn, 10));
                    that.setDataValue('accessToken', newAccessToken);
                    that.setDataValue('expiresIn', parseInt(body.expiresIn, 10) - 100);
                    that.save().then(function(result) {
                        cb(null, result);
                    }).catch(function(err) {
                        cb(err, null);
                    });
                });
            },
            isExpired: function() {
                console.log(moment(this.updatedAt).unix() + this.expiresIn);
                console.log(moment().unix());
                if(moment(this.updatedAt).unix() + this.expiresIn > moment().unix()) {
                    return false;
                }
                return true;
            }
        }
    });

    return OauthProvider;
};
