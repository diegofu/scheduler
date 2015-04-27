'user strict';

var models = require('../models');

exports.create = function(req, res) {
    models.Booking.create(req.body).then(function(booking) {
        res.json(booking);
    }).catch(function(err) {
        res.status(500).json(err);
    });
}

exports.list = function(req, res) {
	models.Booking.findAll({
		include: [{
			model: models.Calendar,
			where: {
				UserId: req.user.id
			}
		}]
	}).then(function(bookings) {
		res.json(bookings);
	}).catch(function(err) {
		res.status(500).json(err);
	});
}