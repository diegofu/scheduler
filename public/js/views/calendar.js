define(['underscore', 'backbone', 'models/calendar', 'text!templates/CalendarTemplate.html'], function(_, Backbone, Calendar, CalendarTemplate) {
    var CalendarView = Backbone.View.extend({
        initialize: function(options) {
            console.log(options);
            this.calendar = new Calendar(options);
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                console.log(that.calendar);
            });

            return this;
        }
    });

    return CalendarView;
});
