'user strict';

var models = require('../models');

exports.create = function(req, res) {
    models.Booking.create(req.body).then(function(booking) {
        res.json(booking);
    }).catch(function(err) {
        res.status(500).json(err);
    });
}