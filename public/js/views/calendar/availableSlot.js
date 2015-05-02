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
        events: {
            'blur .datetime': 'updateTime'
        },
        updateTime: function(e) {
            console.log(e.target.dataset.name);
            this.model.set(e.target.dataset.name, e.target.value);
            if(this.model.hasChanged()) {
                this.model.save();
            }
        },
        render: function() {
            this.$el.html(_.template(AvailableSlotTemplate, {
                slot: this.model
            }));

            this.$('.datetimepicker').datetimepicker({
                format: 'H:mm',
            });
            return this;
        }
    });

    return AvailableSlot;
});
