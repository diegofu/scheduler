var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('./config/config');
var consolidate = require('consolidate');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', consolidate['swig']);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.sessionSecret
}));


// use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



var LocalStrategy = require('passport-local').Strategy;
var models  = require('./models');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.User.findOne({
    	where: {
    		id: id
    	}
    }).success(function(user) {
        done(null, user);
    }).error(function(err){
    	done(err, null)
    });
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        models.User.findOne({
            where: {
                username: username
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


module.exports = app;
