define([
    'underscore',
    'backbone',
    'bootstrap',
    'models/Calendar',
    'text!templates/TabTemplate.html'
], function(_, Backbone, Bootstrap, Calendar, TabTemplate) {
    var EditCalendar = Backbone.View.extend({
        el: $('#content'),
        initialize: function(options) {
            this.calendar = new Calendar({
                id: options.id
            });
            this.options = options;
        },
        render: function() {
            var that = this;
            this.$el.html(_.template(TabTemplate, {
                tab: this.options.tab
            }));

            require(['views/calendars/' + this.options.tab], function(TabView) {
                var tabView = new TabView(that.options);
                tabView.render();
            })
        },
        events: {
            'click .calendar-control': 'changeView'
        },
        changeView: function(e) {
            e.preventDefault();
            this.undelegateEvents();
            Backbone.history.navigate('#/calendars/' + this.calendar.get('id') + '/' + e.target.dataset.view, {trigger: true});
        },
    });

    return EditCalendar;
});
