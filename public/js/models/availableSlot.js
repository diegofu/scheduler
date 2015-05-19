define(['underscore', 'backbone'], function(_, Backbone) {
    var AvailableSlot = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        url: function() {
            if(this.has('id')) {
                return '/calendars/' + this.options.calendarId + '/availableSlot/' + this.get('id');
            } else {
                return '/calendars/' + this.options.calendarId + '/availableSlot';
            }
        }
    });

    return AvailableSlot;
});