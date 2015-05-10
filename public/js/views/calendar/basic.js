define([
    'underscore',
    'backbone',
    'moment',
    'serializejson',
    'models/Calendar',
    'views/booking/scheduler',
    'text!templates/Calendars/BasicTemplate.html'
], function(_, Backbone, Moment, serializeJSON, Calendar, SchedulerView, BasicTemplate) {
    var CalendarBasic = Backbone.View.extend({
        id: 'tab-content',
        initialize: function(options) {
            this.calendar = options.model;
            this.schedulerView = new SchedulerView({schedulerId: this.calendar.get('id')});
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                var minLength = _.min([that.calendar.get('defaultLength'), that.calendar.get('minLength'), that.calendar.get('maxLength')]);
                var slots = that.calculateSlots(minLength);
                that.$el.html(_.template(BasicTemplate, {
                    calendar: that.calendar,
                    moment: Moment,
                    minLength: minLength,
                    slots: slots
                })).promise().done(function() {
                    that.$el.append(that.schedulerView.render().el);
                });
            });

            return this;
        },
        events: {
            'keyup #calendar-displaySlot': 'updateLength',
            'submit form#save-calendar-form': 'saveCalendar'
        },
        calculateSlots: function(length) {
            var slots = [];
            for (var i = length; i <= 1440; i += length) {
                slots.push(i);
            }
            return slots;
        },
        updateLength: _.debounce(function(e) {
            if (e.target.value < 1 || e.target.value > 1440) {
                $(e.target).parents('.form-group').addClass('has-error');
                return;
            }

            var displaySlot = parseInt(e.target.value);
            var slots = this.calculateSlots(displaySlot);

            var $defaultLength = $('#calendar-defaultLength');
            var $minLength = $('#calendar-minLength');
            var $maxLength = $('#calendar-maxLength');
            $defaultLength.empty();
            $minLength.empty();
            $maxLength.empty();
            $.each(slots, function(key, slot) {
                $defaultLength.append($('<option></option>').attr('value', slot).text(slot));
                $minLength.append($('<option></option>').attr('value', slot).text(slot));
                $maxLength.append($('<option></option>').attr('value', slot).text(slot));
            });

        }, 500, false),
        saveCalendar: function(e) {
            e.preventDefault();
            $('#save-calendar-form-button').attr('disabled', 'disabled');
            console.log(this.calendar);
            var that = this;
            this.calendar.save($(e.target).serializeJSON({useIntKeysAsArrayIndex: true}), {
                success: function(model, response) {
                    // @TODO only update if the length changes
                    $('#save-calendar-form-button').removeAttr('disabled');
                    that.schedulerView.render();
                },
                error: function(model, response) {
                    console.log(model);
                    console.log(response);
                }
            });
        }
    });

    return CalendarBasic;
});
