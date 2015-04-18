'user strict';

var models = require('../models');

exports.create = function(req, res) {
	models.Calendar.create();
	models.Calendar.create(req.body).success(function(calendar) {
		calendar.setUser(req.user).success(function() {
			res.json(calendar);
		}).error(function(err) {
			res.status(400).send(err);
		})
	}).error(function(err) {
		res.status(400).send(err);
	});
}

exports.list = function(req, res) {
	res.status(400).send('err');
}

exports.update = function(req, res) {
	res.status(400).send('err');
}

exports.delete = function(req, res) {
	res.status(400).send('err');
}

exports.calendarByID = function(req, res, next, id) {
	return res.status(400).send({
		message: 'Article is invalid'
	});
}