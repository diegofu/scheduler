define(['underscore', 'backbone', 'models/calendar', 'text!templates/CreateCalendarTemplate.html', 'serializejson'], function(_, Backbone, Calendar, CreateCalendarTemplate) {
    var CreateCalendar = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(CreateCalendarView));
        },
        events: {
        	'submit form#create-calendar-form': 'createCalendar'
        },
        createCalendar: function(e) {
            e.preventDefault();
            var calendar = new Calendar();
            console.log($(e.target).serializeJSON());
            calendar.save($(e.target).serializeJSON());
        }
    });

    return CreateCalendar;
});
