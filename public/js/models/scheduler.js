define(['underscore', 'backbone', 'moment'], function(_, Backbone, moment) {
    var Scheduler = Backbone.Model.extend({
        initialize: function(options) {
            this.options = options;
        },
        urlRoot: '/calendars/all',
        minAvailability: function() {
            var min = undefined;
            _.each(this.get('DayOfWeeks'), function(day) {
                var tempMin = _.min(day.Availabilities, function(availability) {
                    return moment(availability.startTime, 'H:mm').unix();
                });

                if(min === undefined || moment(min.startTime, 'H:mm').unix() > moment(tempMin.startTime, 'H:mm').unix()) {
                    min = tempMin;
                }
            });

            return min;
        },
        maxAvailability: function() {
            var max = undefined;
            _.each(this.get('DayOfWeeks'), function(day) {
                var tempMax = _.max(day.Availabilities, function(availability) {
                    return moment(availability.startTime, 'H:mm').unix();
                });

                if(max === undefined || moment(max.startTime, 'H:mm').unix() < moment(tempMax.startTime, 'H:mm').unix()) {
                    min = tempMax;
                }
            });

            return max;
        }
    });

    return Scheduler;
});
