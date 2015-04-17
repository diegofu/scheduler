'user strict';

var passport = require('passport');
var models = require('../models');
/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

exports.signin = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            })
        }
    })(req, res);
}

exports.signup = function(req, res) {
	models.User.create(req.body).success(function(user) {
		res.json(user);
	}).error(function(err) {
		res.status(400).send(err);
	});
}