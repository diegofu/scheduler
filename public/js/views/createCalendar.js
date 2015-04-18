define(['underscore', 'backbone', 'models/session', 'text!templates/CreateCalendarView.html'], function(_, Backbone, Session, CreateCalendarView) {
    var CreateCalendar = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(CreateCalendarView));
        },
        events: {
            'submit form#login-form': 'login'
        },
        login: function(e) {
            e.preventDefault();
            var session = new Session();
            session.login($(e.target).serializeArray());
        }
    });

    return CreateCalendar;
});
