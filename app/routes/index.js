var models = require('../models');
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	res.render('index', {
      title: 'Express'
    });
});


module.exports = router;
