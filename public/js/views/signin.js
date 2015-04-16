define(['underscore', 'backbone', 'models/user', 'text!templates/SigninView.html'], function(_, Backbone, User, SigninView) {
    var Signin = Backbone.View.extend({
    	el: $('#content'),
        initialize: function() {
            this.user = new User();
        },
        render: function() {
        	this.$el.html(_.template(SigninView));
        },
        events: {
        }
    });

    return Signin;
});
