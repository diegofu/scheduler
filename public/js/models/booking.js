define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Booking = Backbone.Model.extend({
        urlRoot: '/bookings',
        initialize: function() {
        }
    });

    return Booking;
});
