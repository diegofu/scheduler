define([
    'underscore',
    'backbone',
    'models/Booking',
    'models/Calendar',
    'text!templates/BookingTemplate.html',
    'moment',
    'serializejson'
], function(_, Backbone, Booking, Calendar, BookingTemplate, moment) {
    var BookSlot = Backbone.View.extend({
    	el: $('#content'),
        initialize: function(options) {
            this.options = options;
            this.calendar = new Calendar({id: options.id});
            this.booking = new Booking();
        },
        render: function() {
            var that = this;

            this.calendar.fetch().done(function() {
                that.booking.set({
                    'startTime': that.options.timestamp,
                    'endTime': moment.unix(that.options.timestamp).add(that.calendar.get('defaultLength'), 'minutes').unix()
                });
                that.$el.html(_.template(BookingTemplate, {
                    booking: that.booking,
                    time: moment.unix(that.options.timestamp).format(),
                    calendar: that.calendar
                }));
            })
        },
        events: {
            'submit #save-booking-form': 'confirmBooking'
        },
        confirmBooking: function(e) {
            e.preventDefault();
            console.log($(e.target).serializeJSON());
            this.booking.set('id', null);
            this.booking.save($(e.target).serializeJSON());
        }
    });

    return BookSlot;
});
