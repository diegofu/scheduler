define([
    'underscore',
    'backbone',
    'models/calendar',
    'collections/googleCalendars',
    'text!templates/CalendarTemplate.html',
    'text!templates/GridTemplate.html',
    'text!templates/ExternalCalendarTemplate.html',
    'moment',
    'serializejson',
    'datetimepicker'
], function(_, Backbone, Calendar, GoogleCalendarCollection, CalendarTemplate, GridTemplate, ExternalCalendarTemplate, moment) {
    var CalendarView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(options) {
            this.calendar = new Calendar(options);
        },
        render: function() {
            var that = this;
            this.calendar.fetch().done(function() {
                var minLength = _.min([that.calendar.get('defaultLength'), that.calendar.get('minLength'), that.calendar.get('maxLength')]);
                var slots = that.calculateSlots(minLength);
                that.$el.html(_.template(CalendarTemplate, {
                    calendar: that.calendar,
                    moment: moment,
                    slots: slots,
                    minLength: minLength
                }));

                that.$('.datetimepicker').datetimepicker({
                    format: 'H:mm',
                });

                that.renderBooking(that.calendar);

                var googleCalendarCollection = new GoogleCalendarCollection();

                googleCalendarCollection.fetch().done(function() {
                    var exterTemp = _.template(ExternalCalendarTemplate, {
                        externalCalendars: googleCalendarCollection,
                        calendar: that.calendar
                    });
                    $('#external-calendars').html(exterTemp);
                });
            });

            return this;
        },
        events: {
            'submit form#save-calendar-form': 'saveCalendar',
            'keyup #calendar-displaySlot': 'updateLength',
            'click .calendar-control': 'updateView'
        },
        updateView: function(e) {
            e.preventDefault();

            console.log(e.target.dataset.href);
        },
        renderBooking: function(calendar) {
            // @TODO: Move all the logic in the template to a model
            $('#gridTemplate').html(_.template(GridTemplate, {
                calendar: calendar,
                moment: moment,
                minAvailability: _.min(calendar.get('Availabilities'), function(availability) {
                    return moment(availability.startTime, 'H:mm').unix();
                }),
                maxAvailability: _.max(calendar.get('Availabilities'), function(availability) {
                    return moment(availability.endTime, 'H:mm').unix();
                })
            }));
        },
        saveCalendar: function(e) {
            e.preventDefault();
            $('#save-calendar-form-button').attr('disabled', 'disabled');

            var that = this;
            this.calendar.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    that.renderBooking(model);
                    $('#save-calendar-form-button').removeAttr('disabled');
                },
                error: function(model, response) {
                    console.log(model);
                    console.log(response);
                }
            });
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
        calculateSlots: function(length) {
            var slots = [];
            for (var i = length; i <= 1440; i += length) {
                slots.push(i);
            }
            return slots;
        }

    });

    return CalendarView;
});
