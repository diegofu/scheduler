var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    config = require('./config/config'),
    consolidate = require('consolidate'),
    routes = require('./app/routes/index'),
    SessionStore  = require('express-mysql-session');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true,
    store: new SessionStore({
        user: config.db.username,
        password: config.db.password,
        database: config.db.database
    })
}));


// use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
require('./app/routes/users')(app);
require('./app/routes/dashboards')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
var models  = require('./app/models');

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
