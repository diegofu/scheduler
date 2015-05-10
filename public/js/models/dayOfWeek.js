define([
    'underscore',
    'backbone',
    'moment'
], function(_, Backbone, moment) {
    var DayOfWeek = Backbone.Model.extend({
        slotAvailable: function(timestamp, interval) {
            for(var i = 0; i < this.get('Availabilities').length; i++) {
                var today = moment.unix(timestamp);

                var availability = this.get('Availabilities')[i];
                var startTime = moment(availability.startTime, 'H:mm').dayOfYear(today.dayOfYear());
                var endTime = moment(availability.endTime, 'H:mm').dayOfYear(today.dayOfYear());

                if(startTime.unix() <= timestamp && endTime.unix() >= timestamp + interval * 60) {
                    return true;
                }
            }
            return false;
        }
    });

    return DayOfWeek;
});