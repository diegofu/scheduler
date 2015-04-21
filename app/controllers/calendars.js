'user strict';

var models = require('../models');

exports.create = function(req, res) {
    return models.Calendar.createCalendar(req.body, req.user).then(function(result) {
        return res.json(result);
    }).catch(function(err) {
        return res.status(500).json(err);
    });
}

exports.list = function(req, res) {
    models.Calendar.findAll({
        where: {
            UserId: req.user.id
        }
    }).then(function(calendars) {
        return res.json(calendars);
    })
}

exports.update = function(req, res) {
    return models.sequelize.transaction(function(t) {
        return models.Calendar.update(req.body, {
            transaction: t,
            where: {
                id: req.body.id
            }
        }).then(function() {
            return models.sequelize.Promise.map(req.body.Availabilities, function(a) {
                return models.Availability.update(a, {
                    where: {
                        id: a.id,
                        CalendarId: req.body.id
                    },
                    transaction: t
                })
            })
        });
    }).then(function(result) {
        return res.json(result);
    }).catch(function(err) {
        return res.status(500).json(err);
    });
}

exports.delete = function(req, res) {
    res.status(400).send('err');
}

exports.calendarByID = function(req, res, next, id) {
    models.Calendar.find({
        where: {
            id: id
        },
        include: [models.Availability]
    }).then(function(calendar) {
        if (!calendar) {
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
