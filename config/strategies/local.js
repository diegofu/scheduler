var models = require('../../app/models');
var passport = require('passport');

module.exports = passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        models.User.findOne({
            where: {
                email: email
            },
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user or invalid password'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Unknown user or invalid password'
                });
            }

            return done(null, user);
        });
    }
));
