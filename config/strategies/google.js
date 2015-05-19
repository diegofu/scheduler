var config = require('../config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var users = require('../../app/controllers/users');

module.exports = passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, params, profile, done) {
        var user = {
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            provider: profile.provider,
            oauthProvider: {
                providerUniqueId: profile.id,
                displayName: profile.displayName,
                provider: profile.provider,
                accessToken: accessToken,
                refreshToken: refreshToken,
                tokenType: params.token_type,
                idToken: params.id_token,
                expiresIn: params.expires_in
            }
        };

        users.saveOAuthUserProfile(req, user, done);
    }
));
