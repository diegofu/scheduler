define(['underscore', 'backbone', 'moment', 'models/Calendar', 'text!templates/Calendars/BasicTemplate.html'], function(_, Backbone, Moment, Calendar, BasicTemplate) {
    var CalendarBasic = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            this.calendar = new Calendar({id: options.id});
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                console.log(that.calendar);
                var minLength = _.min([that.calendar.get('defaultLength'), that.calendar.get('minLength'), that.calendar.get('maxLength')]);
                var slots = that.calculateSlots(minLength);
                that.$el.html(_.template(BasicTemplate, {
                    calendar: that.calendar,
                    moment: Moment,
                    minLength: minLength,
                    slots: slots
                }));
            });

            return this;
        },
        calculateSlots: function(length) {
            var slots = [];
            for (var i = length; i <= 1440; i += length) {
                slots.push(i);
            }
            return slots;
        }
    });

    return CalendarBasic;
});
