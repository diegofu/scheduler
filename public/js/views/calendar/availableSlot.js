define([
    'underscore',
    'backbone',
    'text!templates/Calendars/AvailableSlotTemplate.html',
    'datetimepicker'
], function(_, Backbone, AvailableSlotTemplate) {
    var AvailableSlot = Backbone.View.extend({
        initialize: function(options) {
            this.render();
        },
        events: {
            'blur .datetime': 'updateTime',
            'click .place-holder': 'showDp'
        },
        updateTime: function(e) {
            this.model.set(e.target.dataset.name, e.target.value);
            if(this.model.hasChanged()) {
                this.model.save();
            }
            $parent = $(e.target).parents('.dp-container');
            $parent.prev('div.place-holder').text(e.target.value).toggle();
            $parent.toggleClass('hidden');
        },
        showDp: function(e) {
            $this = $(e.target);
            $this.toggle();
            $this.next('div').toggleClass('hidden').find('input.datetime').focus();
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
