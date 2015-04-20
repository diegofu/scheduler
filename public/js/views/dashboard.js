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
        }
    });

    return Dashboard;
});
