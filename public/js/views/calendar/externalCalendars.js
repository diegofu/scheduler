define([
    'underscore',
    'backbone',
    'collections/googleCalendars',
    'text!templates/Calendars/ExternalCalendarTemplate.html',
    'datetimepicker'
], function(_, Backbone, GoogleCalendarCollection, ExternalCalendarTemplate) {
    var ExternalCalendar = Backbone.View.extend({
        el: $('#tab-content'),
        initialize: function(options) {
            this.options = options;
            this.googleCalendarCollection = new GoogleCalendarCollection();
            this.render();
        },
        events: {
            'change .external-calendar': 'toggleCalendar'
        },
        toggleCalendar: function(e) {
            // Can't use save or destroy function
        },
        render: function() {
            var that = this;

            this.googleCalendarCollection.fetch().done(function() {
                var exterTemp = _.template(ExternalCalendarTemplate, {
                    externalCalendars: that.googleCalendarCollection
                });
                that.$el.html(exterTemp);
            });
        }
    });

    return ExternalCalendar;
});
