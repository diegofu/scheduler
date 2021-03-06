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

// @TODO: I dont know wtf I am doing here
exports.update = function(req, res) {
    // console.log(req.calendar);
    return models.Calendar.update(req.body, {
        where: {
            id: req.calendar.id
        }
    }).then(function(result) {
        res.json(req.body);
    });
}

exports.delete = function(req, res) {
    req.calendar.destroy().then(function(calendar) {
        res.json(calendar);
    }).catch(function(err) {
        res.status(500).json(err);
    });
}

exports.calendarByID = function(req, res, next, id) {
    models.Calendar.find({
        where: {
            id: id
        }
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

exports.availabilities = function(req, res) {
    models.DayOfWeek.findAll({
        include: models.Availability,
        where: {
            CalendarId: req.calendar.id
        }
    }).then(function(day) {
        res.json(day);
    }).catch(function(err) {
        res.status(404).json(err);
    })
}

exports.hasAuthorization = function(req, res, next) {
    findCalendar(req, res, function() {
        if (req.calendar.UserId !== req.user.id) {
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    })
};

var findCalendar = function(req, res, next) {
    if(!req.calendar) {
        if(req.body.calendarId) {
            var calendarId = req.body.calendarId;
        } else if (req.body.CalendarId) {
            var calendarId = req.body.CalendarId;
        } else {
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }

        models.Calendar.find({
            where: {
                id: calendarId
            }
        }).then(function(calendar) {
            req.calendar = calendar;
            next();
        })
    } else {
        next();
    }

}

exports.all = function(req, res) {
    models.Calendar.find({
        include: [{
            model: models.DayOfWeek,
            include: models.Availability
        }, {
            model: models.Booking
        }],
        where: {
            id: req.params.id
        }
    }).then(function(calendar) {
        res.json(calendar);
    });
};