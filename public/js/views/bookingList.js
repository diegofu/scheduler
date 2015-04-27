define([
    'underscore',
    'backbone',
    'collections/Bookings'
], function(_, Backbone, Bookings) {
    var BookingList = Backbone.View.extend({
    	el: $('#content'),
        initialize: function() {
            this.bookings = new Bookings();
        },
        render: function() {
            var that = this;

            this.bookings.fetch().done(function() {
                console.log(that.bookings);
            })
        }
        
    });

    return BookingList;
});
