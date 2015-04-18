define(['underscore', 'backbone', 'models/session', 'text!templates/NavbarView.html'], function(_, Backbone, Session, NavbarView) {
    var Navbar = Backbone.View.extend({
        initialize: function() {
            this.session = new Session();
        },
        render: function() {
            var that = this;
            this.session.fetch().done(function() {
                that.$el.html(_.template(NavbarView, {
                    session: that.session
                }));
            });

            return this;
        }
    });

    return Navbar;
});
