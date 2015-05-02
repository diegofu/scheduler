define(['underscore', 'backbone'], function(_, Backbone) {
    var AvailableSlot = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        url: function() {
            return '/calendars/' + this.options.calendarId + '/availableSlot/' + this.get('id');
        }
    });

    return AvailableSlot;
});