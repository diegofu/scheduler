define(['underscore', 'backbone', 'moment'], function(_, Backbone, moment) {
    var Calendar = Backbone.Model.extend({
        urlRoot: '/calendars',
        defaults: {
            Availabilities: [{
                dayOfWeek: 1,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 2,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 3,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 4,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 5,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 6,
                startTime: "0900",
                endTime: "1800",
            }, {
                dayOfWeek: 7,
                startTime: "0900",
                endTime: "1800",
            }],
            defaultLength: 60,
            minLength: 60,
            maxLength: 60
        },
        slotBooked: function(startTimestamp) {
            if(!this.has('id') || _.isEmpty(this.get('Bookings'))) {
                return false;
            }

            var endTimestamp = startTimestamp + (this.get('minLength') * 60);
            for(var i = 0; i < this.get('Bookings').length; i++) {
                console.log(this.get('Bookings')[i].startTime);
                console.log(this.get('Bookings')[i].endTime);
                if(
                    (startTimestamp >= this.get('Bookings')[i].startTime && startTimestamp < this.get('Bookings')[i].endTime) ||
                    (endTimestamp > this.get('Bookings')[i].startTime && endTimestamp <= this.get('Bookings')[i].endTime)
                ) {
                    return true;
                }
            }
            return false;
        }
    });

    return Calendar;
});
