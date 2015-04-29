define(['underscore', 'backbone', 'models/googleCalendar'], function(_, Backbone, GoogleCalendar) {
    var GoogleCalendars = Backbone.Collection.extend({
        url: '/externalCalendars',
        model: GoogleCalendar
    });

    return GoogleCalendars;
});