require(['config'], function() {
    require(['underscore', 'backbone', 'routerSecure', 'vm', 'views/navbar'], function(_, Backbone, Router, Vm, Navbar) {
        var navbar = Vm.create({}, 'Navbar', Navbar);
        Router.initialize({
            navbar: navbar
        });
    });
})
