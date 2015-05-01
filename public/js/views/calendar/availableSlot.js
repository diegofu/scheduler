define([
    'underscore',
    'backbone',
    'text!templates/Calendars/AvailableSlot.html',
    'datetimepicker'
], function(_, Backbone, AvailableSlotTemplate) {
    var AvailableSlot = Backbone.View.extend({
        initialize: function(options) {
            this.render();
        },

        render: function() {
            console.log(this.model);
            this.$el.html(_.template(AvailableSlotTemplate, {
                slot: this.model
            }));
            console.log(this);

            this.$('.datetimepicker').datetimepicker({
                format: 'H:mm',
            });
            return this;
        }
    });

    return AvailableSlot;
});
