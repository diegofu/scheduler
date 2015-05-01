define(['underscore', 'backbone'], function(_, Backbone) {
    var AvailableSlot = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            console.log(this.model);
        }
    });

    return AvailableSlot;
});
