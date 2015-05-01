define([
    'underscore',
    'backbone',
    'moment',
    'models/availableSlot',
    'collections/availabilities',
    'views/calendar/availableSlot',
    'text!templates/Calendars/TimesTemplate.html'
], function(_, Backbone, moment, AvailableSlot, AvailabilityCollection, AvailableSlotView, TimesTemplate) {
    var CalendarTimes = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            var that = this;
            this.options = options;

            this.availabilities = new AvailabilityCollection(this.options);
            this.listenTo(this.availabilities, 'add', this.addOne);
            this.listenTo(this.availabilities, 'reset', this.addAll);


        },
        render: function() {
            var that = this;
            this.availabilities.fetch({
                reset: true,
                silent: true
            }).done(function() {
                that.$el.html(_.template(TimesTemplate, {
                    availabilities: that.availabilities,
                    moment: moment
                }));

                that.availabilities.trigger('reset');
            })

        },
        addOne: function(availability) {
            _.each(availability.get('Availabilities'), function(slot) {
                var view = new AvailableSlotView({
                    model: new AvailableSlot(slot)
                });

                $('#availability-' + availability.cid).append(view.render().el);
            });
        },
        addAll: function() {
            this.availabilities.each(this.addOne, this);
        }
    });

    return CalendarTimes;
});
