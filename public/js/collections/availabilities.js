define(['underscore', 'backbone'], function(_, Backbone) {
    var Availabilities = Backbone.Collection.extend({
        initialize: function(options) {
            this.options = options;
        },
        url: function() {
            return '/calendars/' + this.options.model.id + '/availabilities';
        },
    });

    return Availabilities;
});