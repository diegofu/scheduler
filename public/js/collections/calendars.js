define(['underscore', 'backbone', 'models/calendar'], function(_, Backbone, Calendar) {
    var Calendars = Backbone.Collection.extend({
        url: '/calendars',
        model: Calendar
    });

    return Calendars;
});