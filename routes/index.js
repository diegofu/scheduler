var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	// console.log(req.user);
    models.User.findAll().then(function(users) {
        res.render('index', {
            title: 'Express',
            users: users,
            user: req.user || null
        });
    });
});

module.exports = router;
