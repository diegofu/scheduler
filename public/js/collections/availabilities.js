define(['underscore', 'backbone', 'models/availability'], function(_, Backbone, Availability) {
    var Availabilities = Backbone.Collection.extend({
        initialize: function(options) {
            this.options = options;
        },
        url: function() {
            return '/calendars/' + this.options.id + '/availabilities';
        },
        model: Availability
    });

    return Availabilities;
});