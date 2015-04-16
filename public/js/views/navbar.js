define(['underscore', 'backbone', 'models/user', 'text!templates/NavbarView.html'], function(_, Backbone, User, NavbarView) {
    var Navbar = Backbone.View.extend({
        initialize: function() {
            this.user = new User();
        },
        render: function() {
        	var that = this;
        	this.user.fetch().done(function() {
        		that.$el.html(_.template(NavbarView, {user: that.user}));
        	});

        	return this;
        }
    });

    return Navbar;
});
