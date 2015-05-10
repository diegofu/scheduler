define([
    'underscore',
    'backbone',
    'collections/googleCalendars',
    'text!templates/Calendars/ExternalCalendarTemplate.html',
    'datetimepicker'
], function(_, Backbone, GoogleCalendarCollection, ExternalCalendarTemplate) {
    var ExternalCalendar = Backbone.View.extend({
        id: 'tab-content',
        initialize: function(options) {
            this.options = options;
            this.googleCalendarCollection = new GoogleCalendarCollection();
            this.render();
        },
        events: {
            'change .external-calendar': 'toggleCalendar'
        },
        toggleCalendar: function(e) {
            var model = this.googleCalendarCollection.get(e.target.dataset.cid);
            console.log(model);
            model.set({CalendarId: this.options.model.id});
            console.log(model);
            if(e.target.checked) {
                // model.unset('id');
                model.save();
            } else {
                model.sync('delete', model);
                model.id = null;
            }
        },
        render: function() {
            var that = this;

            this.googleCalendarCollection.fetch().done(function() {
                var exterTemp = _.template(ExternalCalendarTemplate, {
                    externalCalendars: that.googleCalendarCollection
                });
                that.$el.html(exterTemp);
            });

            return this;
        }
    });

    return ExternalCalendar;
});
