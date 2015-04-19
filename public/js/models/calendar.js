define(['underscore', 'backbone'], function(_, Backbone) {
    var Calendar = Backbone.Model.extend({
        urlRoot: '/calendars',
    });

    return Calendar;
});