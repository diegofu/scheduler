define(['underscore', 'backbone', 'models/calendar', 'text!templates/CalendarTemplate.html', 'routerSecure', 'serializejson'], function(_, Backbone, Calendar, CalendarTemplate) {
    var CreateCalendar = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {
            this.calendar = new Calendar();
        },
        render: function() {
            this.$el.html(_.template(CalendarTemplate, {calendar: this.calendar}));
        },
        events: {
            'submit form#save-calendar-form': 'createCalendar'
        },
        createCalendar: function(e) {
            e.preventDefault();
            var calendar = new Calendar();
            calendar.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    console.log(model);
                    console.log(response);
                },
                error: function(model, response) {
                    console.log(model);
                    console.log(response);
                },
                wait: true
            });
        }
    });

    return CreateCalendar;
});
