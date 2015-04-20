define(['underscore', 'backbone', 'models/calendar', 'text!templates/CalendarTemplate.html'], function(_, Backbone, Calendar, CalendarTemplate) {
    var CalendarView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(options) {
            this.calendar = new Calendar(options);
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                that.$el.html(_.template(CalendarTemplate, {calendar: that.calendar}));
            });

            return this;
        }
    });

    return CalendarView;
});
