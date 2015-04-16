'user strict';

var passport = require('passport');
/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(null);
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