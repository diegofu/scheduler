var models = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/create', function(req, res) {
    models.User.create({
        username: req.param('username'),
        password: req.param('password')
    }).then(function(user) {
        res.json(user);
    });
});

router.post('/signin', function(req, res) {
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
});

router.get('/:user_id/destroy', function(req, res) {
    models.User.find({
        where: {
            id: req.param('user_id')
        },
        include: [models.Task]
    }).then(function(user) {
        models.Task.destroy({
            where: {
                UserId: user.id
            }
        }).then(function(affectedRows) {
            user.destroy().then(function() {
                res.redirect('/');
            });
        });
    });
});

router.post('/:user_id/tasks/create', function(req, res) {
    models.User.find({
        where: {
            id: req.param('user_id')
        }
    }).then(function(user) {
        models.Task.create({
            title: req.param('title')
        }).then(function(title) {
            title.setUser(user).then(function() {
                res.redirect('/');
            });
        });
    });
});

router.get('/:user_id/tasks/:task_id/destroy', function(req, res) {
    models.User.find({
        where: {
            id: req.param('user_id')
        }
    }).then(function(user) {
        models.Task.find({
            where: {
                id: req.param('task_id')
            }
        }).then(function(task) {
            task.setUser(null).then(function() {
                task.destroy().then(function() {
                    res.redirect('/');
                });
            });
        });
    });
});


module.exports = router;
