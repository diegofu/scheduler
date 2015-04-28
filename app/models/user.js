"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
                isUnique: function(value, next) {
                    var self = this;
                    User.find({
                            where: {
                                email: value
                            }
                        })
                        .then(function(user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                                return next('Email already in use!');
                            }
                            return next();
                        })
                        .catch(function(err) {
                            return next(err);
                        });
                }
            },
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
        },
        salt: DataTypes.STRING,
        provider: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        instanceMethods: {
            authenticate: function(password) {
                return this.password === this.hashPassword(password);
            },
            hashPassword: function(password) {
                if (this.salt && password) {
                    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
                }
                return password;
            }
        }
    }, {
        validate: {
            localPasswordValidate: function() {
                return this.provider !== 'local' || (this.password && this.password.length > 5);
            },
            localUsernameValidate: function() {
                if(this.provider !== 'local') {
                    return true;
                }

            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Calendar),
                User.hasMany(models.OauthProvider)
            }
        }
    });

    User.hook('beforeCreate', function(user, options, fn) {
        if (user.password && user.password.length > 5) {
            user.salt = crypto.randomBytes(16).toString('base64');
            user.password = user.hashPassword(user.password);
        }
        fn(null, user);
    });

    return User;
};
