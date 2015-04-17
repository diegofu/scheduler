"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
    });

    User.hook('beforeCreate', function(user, options, fn) {
        if (user.password && user.password.length > 6) {
            user.salt = crypto.randomBytes(16).toString('base64');
            user.password = user.hashPassword(user.password);
        }
        fn(null, user);
    });

    return User;
};
