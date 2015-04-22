require(['config'], function() {
    require(['underscore', 'backbone', 'router', 'vm', 'views/navbar'], function(_, Backbone, Router, Vm, Navbar) {
        var navbar = Vm.create({}, 'Navbar', Navbar);
        navbar.render();
        Router.initialize({
            navbar: navbar
        });
    });
})
