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
                var slots = that.calculateSlots(that.calendar.get('defaultLength'));
                that.$el.html(_.template(CalendarTemplate, {
                    calendar: that.calendar,
                    moment: moment,
                    slots: slots
                }));
            });

            return this;
        },
        events: {
            'submit form#save-calendar-form': 'saveCalendar',
            'keyup #calendar-displaySlot': 'updateLength'
        },
        saveCalendar: function(e) {
            e.preventDefault();
            this.calendar.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    // update the model to the returned model
                    console.log(model);
                    console.log(response);
                },
                error: function(model, response) {
                    console.log(model);
                    console.log(response);
                },
                // wait: true
            });
        },
        updateLength: _.debounce(function(e) {
            if(e.target.value < 1 || e.target.value > 1440) {
                $(e.target).parents('.form-group').addClass('has-error');
                return;
            }
        }, 500, false),
        calculateSlots: function(length) {
            var slots = [];
            for(var i = length; i <= 1440; i += length) {
                slots.push(i);
            }
            return slots;
        }

    });

    return CalendarView;
});
