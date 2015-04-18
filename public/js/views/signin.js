define(['underscore', 'backbone', 'models/session', 'text!templates/SigninView.html', 'serializejson'], function(_, Backbone, Session, SigninView) {
    var Signin = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(SigninView));
        },
        events: {
            'submit form#login-form': 'login'
        },
        login: function(e) {
            e.preventDefault();
            var session = new Session();
            session.login($(e.target).serializeJSON());
        }
    });

    return Signin;
});
