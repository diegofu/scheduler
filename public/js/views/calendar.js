define([
    'underscore',
    'backbone',
    'models/calendar',
    'text!templates/CalendarTemplate.html',
    'moment',
    'serializejson',
    'datetimepicker'
], function(_, Backbone, Calendar, CalendarTemplate, moment) {
    var CalendarView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(options) {
            this.calendar = new Calendar(options);
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                that.$el.html(_.template(CalendarTemplate, {
                    calendar: that.calendar,
                    moment: moment
                }));
            });

            return this;
        },
        events: {
            'submit form#save-calendar-form': 'saveCalendar'
        },
        saveCalendar: function(e) {
            e.preventDefault();
            this.calendar.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    console.log(model);
                    console.log(response);
                },
                error: function(model, response) {
                    console.log(model);
                    console.log(response);
                },
                // wait: true
            });
        }

    });

    return CalendarView;
});
