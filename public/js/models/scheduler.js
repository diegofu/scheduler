define(['underscore', 'backbone', 'moment'], function(_, Backbone, moment) {
    var Scheduler = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        urlRoot: '/calendars/all',
        minAvailability: function() {
            console.log(this);
            return _.min(this.get('DayOfWeek'), function(availability) {
                return moment(availability.startTime, 'H:mm').unix();
            });
        }
    });

    return Scheduler;
});
