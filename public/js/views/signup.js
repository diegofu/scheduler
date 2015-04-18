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
            var user = new User();
            user.save($(e.target).serializeJSON(), {
            	success: function(user, response) {
            		window.location.href = '/dashboard';
            	},
            	error: function(user, response) {
            		console.log(user);
            		console.log(response);
            	}
            });
        }
    });

    return Signin;
});
