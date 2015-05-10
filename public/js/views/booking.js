define([
    'underscore',
    'backbone',
    'models/Booking',
    'models/Calendar',
    'text!templates/BookingTemplate.html',
    'moment',
    'serializejson'
], function(_, Backbone, Booking, Calendar, BookingTemplate, moment) {
    var BookSlot = Backbone.View.extend({
    	id: 'content',
        initialize: function(options) {
            this.options = options;
            this.calendar = new Calendar({id: options.calendarId});
            this.booking = new Booking({CalendarId: options.calendarId});
        },
        render: function() {
            var that = this;

            this.calendar.fetch().done(function() {
                that.booking.prepareDropdown(that.calendar, that.options.timestamp);

                that.$el.html(_.template(BookingTemplate, {
                    booking: that.booking,
                    time: moment.unix(that.options.timestamp).format(),
                    calendar: that.calendar
                }));
            });

            return this;
        },
        events: {
            'submit #save-booking-form': 'confirmBooking'
        },
        confirmBooking: function(e) {
            e.preventDefault();
            var that = this;
            this.booking.set('endTime', parseInt(this.booking.get('startTime')) + parseInt($('#booking-length').val() * 60));

            this.booking.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    Backbone.history.navigate('#/calendars/' + that.calendar.get('id'), {
                        trigger: true
                    });
                },
                error: function(model, response) {
                    // @TODO: display error
                }
            });
        }
    });

    return BookSlot;
});
