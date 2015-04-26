"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isUnique: function(value, next) {
                    var self = this;
                    User.find({
                            where: {
                                username: value
                            }
                        })
                        .then(function(user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                                return next('Username already in use!');
                            }
                            return next();
                        })
                        .catch(function(err) {
                            return next(err);
                        });
                }
            }
        },
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
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        salt: DataTypes.STRING
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
    	classMethods: {
    		associate: function(models) {
    			User.hasMany(models.Calendar)
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
