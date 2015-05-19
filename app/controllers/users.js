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

exports.saveOAuthUserProfile = function(req, userProfile, done) {
    if (!req.user) {
        models.User.find({
            include: [{
                model: models.OauthProvider,
                where: {
                    providerUniqueId: userProfile.oauthProvider.providerUniqueId,
                    provider: userProfile.oauthProvider.provider
                }
            }]
        }).then(function(user) {
            console.log(user);
            if (user) {
                return done(null, user);
            } else {
                return models.sequelize.transaction(function(t) {
                    return models.User.create(userProfile, {
                        transaction: t
                    }).then(function(user) {
                        userProfile.oauthProvider.UserId = user.getDataValue('id');
                        return models.OauthProvider.create(userProfile.oauthProvider, {
                            transaction: t
                        }).then(function(){
                            return user;
                        });
                    });
                }).then(function(result) {
                    console.log(result);
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
