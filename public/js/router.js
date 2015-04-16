// define(['jquery', 'underscore', 'backbone', 'vm'], function($, _, Backbone, Navbar) {
// 	var AppRouter = Backbone.Router.extend({
// 		routes: {
// 			'*actions': 'defaultRoute',
// 			'users/signin': 'signin'
// 		},
// 		initialize: function() {
// 			if(this.navbar) {
// 				this.navbar = new Navbar();
// 				$('#navbar').html(navbar.render().el);
// 			}
// 		},
// 		signin: function() {
// 			if(this.sigin) {
// 				signin =
// 			}
// 		}
// 	});

// 	var initialize = function() {
// 		var app_router = new AppRouter();
// 		Backbone.history.start();
// 	};

// 	return {
// 		initialize: initialize
// 	};
// });

define([
  'jquery',
  'underscore',
  'backbone',
  'vm'
], function ($, _, Backbone, Vm) {
  var AppRouter = Backbone.Router.extend({
    initialize: function(options) {
      if(!this.navbar) {
			this.navbar = options.navbar;
			$('#navbar').html(this.navbar.render().el);
		}
    },
    register: function (route, name, path) {
      var self = this;

      console.log(route);
      this.route(route, name, function () {
        var args = arguments;

        require([path], function (module) {
          var options = null;
          var parameters = route.match(/[:\*]\w+/g);

          // Map the route parameters to options for the View.
          if (parameters) {
            options = {};
            _.each(parameters, function(name, index) {
              options[name.substring(1)] = args[index];
            });
          }

          var page = Vm.create(self.navbar, name, module, options);
          page.render();
        });
      });
    }
  });

  var initialize = function(options){
    var router = new AppRouter(options)
    router.register('users/signin', 'Signin', 'views/signin');
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
