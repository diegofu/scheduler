define(['jquery', 'underscore', 'backbone', 'models/Calendar'], function($, _, Backbone, Calendar) {
    var Booking = Backbone.Model.extend({
        urlRoot: '/bookings',
        initialize: function(options) {
        	this.calendar = new Calendar({
        		id: options.CalendarId
        	});

        	var that = this;
        	this.calendar.fetch().done(function() {
        		that.set({
        			lengthDropdown: [
        				that.calendar.get('defaultLength')
        			]
        		});

        		if(that.calendar.get('minLength') != that.calendar.get('defaultLength')) {
        			that.get('lengthDropdown').push(that.calendar.get('minLength'));
        		}

        		if(that.calendar.get('maxLength') != that.calendar.get('defaultLength')) {
        			that.get('lengthDropdown').push(that.calendar.get('maxLength'));
        		}
        	});
        }
    });

    return Booking;
});
