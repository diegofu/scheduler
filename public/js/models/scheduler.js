define(['underscore', 'backbone', 'moment'], function(_, Backbone, moment) {
    var Scheduler = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        urlRoot: '/calendars/all',
        minAvailability: function() {
            console.log(this);
            var min = Number.MAX_VALUE;
            _.each(this.get('DayOfWeeks'), function(day) {
                var temp_min = _.min(day.Availabilities, function(availability) {
                    console.log(moment(availability.startTime, 'H:mm').unix());
                    return moment(availability.startTime, 'H:mm').unix();
                });

                console.log(temp_min);
                if(min > temp_min) {
                    min = temp_min;
                }
            });1

            return min;
        }
    });

    return Scheduler;
});
