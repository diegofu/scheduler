define(['underscore', 'backbone', 'models/calendar', 'text!templates/CreateCalendarView.html', 'serializejson'], function(_, Backbone, Calendar, CreateCalendarView) {
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
            calendar.save($(e.target).serializeJSON());
            console.log($(e.target).serializeJSON());
        }
    });

    return CreateCalendar;
});
