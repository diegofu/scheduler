define(['underscore', 'backbone', 'models/calendar', 'text!templates/CalendarTemplate.html', 'serializejson'], function(_, Backbone, Calendar, CalendarTemplate) {
    var CreateCalendar = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {
            this.calendar = new Calendar();
        },
        render: function() {
            this.$el.html(_.template(CalendarTemplate, {calendar: this.calendar}));
        },
        events: {
        	'submit form#create-calendar-form': 'createCalendar'
        },
        createCalendar: function(e) {
            e.preventDefault();
            var calendar = new Calendar();
            calendar.save($(e.target).serializeJSON());
        }
    });

    return CreateCalendar;
});
