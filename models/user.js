"use strict";
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    classMethods: {
      hashPassword: function(password) {
      	if (this.salt && password) {
			return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
		} else {
			return password;
		}
      }
    }
  });

  User.hook('beforeCreate', function(user, options, fn) {
		if(user.password && user.password.length > 6) {
	  		user.salt = this.salt = crypto.randomBytes(16).toString('base64');
	  		user.password = User.hashPassword(user.password);
	  	}
		fn(null, user);
	});

  return User;
};
