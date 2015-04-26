define(['underscore', 'backbone', 'collections/calendars', 'text!templates/DashboardTemplate.html'], function(_, Backbone, CalendarCollection, DashboardTemplate) {
    var Dashboard = Backbone.View.extend({
    	el: $('#content'),
        initialize: function() {
            this.calendarColleciton = new CalendarCollection;
        },
        render: function() {
            var that = this;
            this.calendarColleciton.fetch().done(function() {
                that.$el.html(_.template(DashboardTemplate, {calendars: that.calendarColleciton}));
            });
        },
        events: {
            'click .remove-calendar': 'removeCalendar'
        },
        // @TODO: Add confirmation
        removeCalendar: function(e) {
            e.preventDefault();
            this.calendarColleciton.get(e.target.dataset.id).destroy({
                success: function(model, response) {
                    // @TODO: Add some visual feedback
                    $(e.target).closest('.well').remove();
                },
                error: function(model, response) {
                    // @TODO: do something
                    console.log(model);
                    console.log(response);
                },
                wait: true
            });
        }
    });

    return Dashboard;
});
