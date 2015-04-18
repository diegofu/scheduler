'user strict';

var models = require('../models');

exports.createCalendar = function(req, res) {
	models.Calendar.create(req.body).success(function(calendar) {
		res.json(calendar);
	}).error(function(err) {
		res.status(400).send(err);
	});
}

