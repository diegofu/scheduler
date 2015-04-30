define([
    'jquery',
    'underscore',
    'backbone',
    'vm'
], function($, _, Backbone, Vm) {
    var AppRouter = Backbone.Router.extend({
        initialize: function(options) {
            if (!this.navbar) {
                this.navbar = options.navbar;
                $('#navbar').html(this.navbar.render().el);
            }
        },
        register: function(route, name, path) {
            var self = this;
            this.route(route, name, function() {
                var args = arguments;

                document.title = name;
                require([path], function(module) {
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
        },
        routes: {
            'calendars/:id(/:tab)': 'editCalendar',
            'calendars/:id': 'editCalendar'
        }
    });

    var initialize = function(options) {
        var router = new AppRouter(options);
        // router.register('calendar/create', 'CalendarView', 'views/calendar');
        // router.register('calendars/:id', 'CalendarView', 'views/calendar');
        // // router.register('calendars/:id/:timestamp', 'BookingView', 'views/booking');
        // router.register('bookings/list', 'BookingList', 'views/bookingList');
        // router.register('', 'Dashboard', 'views/dashboard');

        router.on('route:editCalendar', function(id, tab) {
            if(tab == undefined) {
                tab = 'basic';
            }
            require(['views/editCalendar'], function(EditCalendarView) {
                var editCalendar = new EditCalendarView({id: id, tab: tab});
                editCalendar.render();
            })
        })

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
