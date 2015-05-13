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
            },
            refreshToken: function(token, cb) {
                refresh(oauthProvider[0].refreshToken, config.google.clientID, config.google.clientSecret, function(err, json, response) {
                    if (err) {
                        return cb(err, json, response);
                    }
                    if (json.error) {
                        return handleError(new Error(response.statusCode + ': ' + json.error));
                    }

                    if (parseInt(res.statusCode / 100, 10) !== 2) {
                      if (body.error) {
                        return cb(new Error(res.statusCode + ': ' + (body.error.message || body.error)), body, res);
                      }
                      if (!body.access_token) {
                        return cb(new Error(res.statusCode + ': refreshToken error'), body, res);
                      }
                      return cb(null, body, res);
                    }

                    var newAccessToken = json.accessToken;
                    if (!newAccessToken) {
                        return handleError(new Error(response.statusCode + ': refreshToken error'));
                    }
                    var expireAt = new Date(+new Date + parseInt(json.expiresIn, 10));
                    oauthProvider[0].setDataValue('accessToken', newAccessToken);
                    oauthProvider[0].save().then(function() {
                        res.redirect('/externalCalendars/' + req.calendar.id);
                    });
                });
            }
        }
    });

    return OauthProvider;
};