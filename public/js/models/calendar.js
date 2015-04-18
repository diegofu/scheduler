define(['underscore', 'backbone'], function(_, Backbone) {
    var Calendar = Backbone.Model.extend({
        url: 'calendars',
    });

    return Calendar;
});