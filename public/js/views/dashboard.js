define(['underscore', 'backbone', 'text!templates/DashboardView.html'], function(_, Backbone, DashboardView) {
    var Dashboard = Backbone.View.extend({
    	el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(DashboardView));
        }
    });

    return Dashboard;
});
