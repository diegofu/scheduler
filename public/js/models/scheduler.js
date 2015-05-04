define(['underscore', 'backbone'], function(_, Backbone) {
    var Scheduler = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        urlRoot: '/calendars/all'
    });

    return Scheduler;
});
