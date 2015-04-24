define([
    'underscore',
    'backbone',
    'models/Booking',
    'text!templates/BookingTemplate.html',
    'moment',
    'serializejson'
], function(_, Backbone, Booking, BookingTemplate, moment) {
    var BookSlot = Backbone.View.extend({
    	el: $('#content'),
        initialize: function(options) {
            this.options = options;
        },
        render: function() {
            var that = this;
            that.$el.html(_.template(BookingTemplate, {
                options: this.options,
                time: moment.unix(this.options.timestamp).format()
            }));
        },
        events: {
            'submit #save-booking-form': 'confirmBooking'
        },
        confirmBooking: function(e) {
            e.preventDefault();
            this.booking = new Booking();
            this.booking.save($(e.target).serializeJSON());
        }
    });

    return BookSlot;
});
