define([
    'underscore',
    'backbone',
    'models/dayOfWeek',
    'moment'
], function(_, Backbone, DayOfWeek, moment) {
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
                    return moment(availability.endTime, 'H:mm').unix();
                });

                if(max === undefined || moment(max.endTime, 'H:mm').unix() < moment(tempMax.endTime, 'H:mm').unix()) {
                    max = tempMax;
                }
            });

            return max;
        },
        /**
         * Check if a time stamp is booked. The time stamp is the start of a lot
         * @author Diego diegofu714@hotmail.com
         * @date   2015-05-09
         * @param  {int} startTimestamp The start time of a slot
         * @return {bool} true if slot is not available
         */
        slotBooked: function(startTimestamp) {
            if(!this.has('id')) {
                return false;
            }

            var endTimestamp = startTimestamp + (this.get('minLength') * 60);
            for(var i = 0; i < this.get('Bookings').length; i++) {
                if(
                    (startTimestamp >= this.get('Bookings')[i].startTime && startTimestamp < this.get('Bookings')[i].endTime) ||
                    (endTimestamp > this.get('Bookings')[i].startTime && endTimestamp <= this.get('Bookings')[i].endTime)
                ) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Return the availability (ies) with the earliest start time and latest end time of a day
         * @author Diego diegofu714@hotmail.com
         * @date   2015-05-07
         * @param  {int} day which day to get
         * @return {Object} object with two availabilities
         */
        getTimeOfDay: function(dayOfWeek) {
            timeOfDay = {};
            timeOfDay.startTime = _.min(dayOfWeek.get('Availabilities'), function(availability) {
                return moment(availability.startTime, 'H:mm').unix();
            }).startTime;

            timeOfDay.endTime = _.max(dayOfWeek.get('Availabilities'), function(availability) {
                return moment(availability.endTime, 'H:mm').unix();
            }).endTime;

            return timeOfDay;
        },
        getDayOfWeek: function(day) {
            result = _.find(this.get('DayOfWeeks'), function(dayOfWeek) {
                if(dayOfWeek.dayOfWeek == day) {
                    return dayOfWeek;
                }
            });

            return new DayOfWeek(result);
        }
    });

    return Scheduler;
});
