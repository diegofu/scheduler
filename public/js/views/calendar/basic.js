define([
    'underscore',
    'backbone',
    'moment',
    'models/Calendar',
    'views/booking/scheduler',
    'text!templates/Calendars/BasicTemplate.html'
], function(_, Backbone, Moment, Calendar, SchedulerView, BasicTemplate) {
    var CalendarBasic = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            this.calendar = new Calendar({id: options.id});
            this.schedulerView = new SchedulerView({id: options.id});
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                var minLength = _.min([that.calendar.get('defaultLength'), that.calendar.get('minLength'), that.calendar.get('maxLength')]);
                var slots = that.calculateSlots(minLength);
                that.$el.html(_.template(BasicTemplate, {
                    calendar: that.calendar,
                    moment: Moment,
                    minLength: minLength,
                    slots: slots
                })).promise().done(function() {
                    that.$el.append(that.schedulerView.render().el);
                });
            });


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
