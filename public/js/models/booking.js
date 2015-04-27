define(['jquery', 'underscore', 'backbone', 'models/Calendar'], function($, _, Backbone, Calendar) {
    var Booking = Backbone.Model.extend({
        urlRoot: '/bookings',
        initialize: function(options) {
        	this.calendar = new Calendar({
        		id: options.CalendarId
        	});

        },
        prepareDropdown: function(calendar, timestamp) {
            this.set({
                lengthDropdown: [
                    calendar.get('defaultLength')
                ]
            });

            if(calendar.get('minLength') != calendar.get('defaultLength')) {
                this.get('lengthDropdown').push(calendar.get('minLength'));
            }

            if(calendar.get('maxLength') != calendar.get('defaultLength')) {
                this.get('lengthDropdown').push(calendar.get('maxLength'));
            }
            this.set({
                'startTime': timestamp,
            });

        }
    });

    return Booking;
});
