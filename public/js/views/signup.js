define(['underscore', 'backbone', 'models/user', 'text!templates/SignupView.html', 'serializejson'], function(_, Backbone, User, SigninView, serializeJson) {
    var Signin = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(SigninView));
        },
        events: {
            'submit form#signup-form': 'signup'
        },
        signup: function(e) {
            e.preventDefault();
            var user = new User($(e.target).serializeJSON());
            user.save();
        }
    });

    return Signin;
});
