require.config({
  paths: {
    'jquery': '../lib/jquery/dist/jquery',
    'underscore': '../lib/underscore-amd/underscore',
    'backbone': '../lib/backbone-amd/backbone',
    'text': '../lib/text/text',
    'bootstrap': '../lib/bootstrap/dist/js/bootstrap',
  },
  shim: {
  	'bootstrap': {
		deps: ['jquery']
  	}
  }
});

require(['underscore', 'backbone', 'router'], function(_, Backbone, Router) {
	Router.initialize();
});