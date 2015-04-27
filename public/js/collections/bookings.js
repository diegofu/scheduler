define(['underscore', 'backbone', 'models/booking'], function(_, Backbone, Booking) {
    var Bookings = Backbone.Collection.extend({
        url: '/bookings',
        model: Booking
    });

    return Bookings;
});