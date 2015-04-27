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
    models.User.create(req.body).then(function(user) {
        req.login(user, function(err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(user);
            }
        });
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

    next();
};

exports.redirectLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/#/users/signin');
    }

    next();
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
