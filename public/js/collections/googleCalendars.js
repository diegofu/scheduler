define(['underscore', 'backbone', 'models/googleCalendar'], function(_, Backbone, GoogleCalendar) {
    var GoogleCalendars = Backbone.Collection.extend({
        initialize: function(options) {
            this.options = options;
        },
        url: function() {
            return '/externalCalendars/' + this.options.calendarId;
        },
        model: GoogleCalendar
    });

    return GoogleCalendars;
});