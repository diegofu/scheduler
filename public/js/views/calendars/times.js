define(['underscore', 'backbone', 'moment', 'collections/availabilities', 'text!templates/Calendars/TimesTemplate.html'], function(_, Backbone, moment, AvailabilityCollection, TimesTemplate) {
    var CalendarBasic = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            this.availabilities = new AvailabilityCollection(options);
        },
        render: function() {
            var that = this;
            this.availabilities.fetch().done(function() {
                that.$el.html(_.template(TimesTemplate, {
                    availabilities: that.availabilities,
                    moment: moment
                }));
            });

            return this;
        }
    });

    return CalendarBasic;
});
