define([
    'underscore',
    'backbone',
    'moment',
    'collections/availabilities',
    'views/calendar/availableSlot',
    'text!templates/Calendars/TimesTemplate.html'
], function(_, Backbone, moment, AvailabilityCollection, AvailableSlotView, TimesTemplate) {
    var CalendarTimes = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            this.options = options;

            this.availabilities = [];
            for(var i = 1; i <= 7; i++) {
                availability = new AvailabilityCollection(_.extend(this.options, {day: i}));
                this.listenTo(availability, 'add', this.addOne);
                this.listenTo(availability, 'reset', this.addAll);

                availability.fetch({reset: true});

                this.availabilities.push(availability);
            }

        },
        render: function() {
            var that = this;
            this.$el.html(_.template(TimesTemplate, {
                availabilities: this.availabilities,
                moment: moment
            }));

            return this;
        },
        addOne: function(availableSlot) {
            var view = new AvailableSlotView({model: availability});
        },
        addAll: function(availableSlots) {
            availableSlots.each(this.addOne, this);
        }
    });

    return CalendarTimes;
});
