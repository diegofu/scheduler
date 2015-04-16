var models = require('../models');
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../public/index.html'));
    // models.User.findAll().then(function(users) {
    //     res.render('index', {
    //         title: 'Express',
    //         users: users,
    //         user: req.user || null
    //     });
    // });
});

module.exports = router;
