'user strict';

var models = require('../models');

exports.create = function(req, res) {
    // This does not work in model as the transaction will be returned instead of the callback
    return models.sequelize.transaction(function(t) {
        var calendar = models.Calendar.build(req.body);
        calendar.setUser(req.user, {
            save: false
        });
        return calendar.save({
            transaction: t
        }).then(function(_calendar) {
            return models.sequelize.Promise.map(req.body.availabilities, function(a) {
                var availability = models.Availability.build(a);
                availability.setCalendar(_calendar, {
                    save: false
                });
                return availability.save({
                    transaction: t
                });
            });
        });
    }).then(function(result) {
        return res.json(result);
    }).catch(function(err) {
        return res.status(500).json(err);
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
    models.Calendar.find({where: {id: id}, include: [models.Availability]}).then(function(calendar) {
        if(!calendar) {
            return res.status(404).send({
                message: 'Calendar not found'
            });
        }

        req.calendar = calendar;
        next();
    });
}

exports.read = function(req, res) {
    res.json(req.calendar);
}
