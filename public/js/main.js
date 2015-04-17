require.config({
  paths: {
    jquery: 'lib/jquery/dist/jquery',
    underscore: 'lib/underscore-amd/underscore',
    backbone: 'lib/backbone-amd/backbone',
    text: 'lib/text/text',
    bootstrap: 'lib/bootstrap-sass/javascripts/bootstrap',
    templates: '../templates',
    serializejson: 'lib/jquery.serializeJSON/jquery.serializejson.min'
  },
  shim: {
  	bootstrap: {
		deps: ['jquery']
  	},
  	serializejson: {
  		deps: ['jquery']
  	}
  }
});

require(['underscore', 'backbone', 'router', 'vm', 'views/navbar'], function(_, Backbone, Router, Vm, Navbar) {
	var navbar = Vm.create({}, 'Navbar', Navbar);
  	navbar.render();
	Router.initialize({navbar: navbar});
});