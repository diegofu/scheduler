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
    req.body.provider = 'local';
    models.User.create(req.body).then(function(user) {
        req.login(user, function(err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(user);
            }
        });
    }).catch(function(err) {
        console.log(err);
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

exports.saveOAuthUserProfile = function(req, user, done) {
    if(!req.user) {
        models.OauthProvider.findOne({
            where: {
                provider: user.oauthProvider.provider,
                providerUniqueId: user.oauthProvider.providerUniqueId
            },
            include: [
                models.User
            ]
        }).then(function(oauthProvider) {
            if(oauthProvider) {
                return done(null, user);
            } else {
                return models.sequelize.transaction(function(t) {
                    return models.User.create(user, {
                        transaction: t
                    }).then(function(_user) {
                        user.oauthProvider.UserId = _user.getDataValue('id');
                        return models.OauthProvider.create(user.oauthProvider, {transaction: t});
                    });
                }).then(function(result) {
                    return done(null, result);
                }).catch(function(err) {
                    return done(err, null);
                });
            }
        });
    } else {
        console.log('no user');
    }
}
