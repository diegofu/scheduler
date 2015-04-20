define(['underscore', 'backbone'], function(_, Backbone) {
    var Calendar = Backbone.Model.extend({
        urlRoot: '/calendars',
        defaults: {
            Availabilities: [
                {
                    dayOfWeek: 1,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 2,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 3,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 4,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 5,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 6,
                    startTime: "0900",
                    endTime: "1800",
                },
                {
                    dayOfWeek: 7,
                    startTime: "0900",
                    endTime: "1800",
                }
            ]
        }
    });

    return Calendar;
});