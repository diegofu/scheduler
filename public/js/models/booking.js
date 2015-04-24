define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Session = Backbone.Model.extend({
        url: '/bookings',
        initialize: function() {
        }
    });

    return Session;
});
