define([
    'underscore',
    'backbone',
    'moment',
    'serializejson',
    'models/availableSlot',
    'collections/availabilities',
    'views/calendar/availableSlot',
    'views/booking/scheduler',
    'text!templates/Calendars/TimesTemplate.html'
], function(_, Backbone, moment, serializeJSON, AvailableSlot, AvailabilityCollection, AvailableSlotView, SchedulerView, TimesTemplate) {
    var CalendarTimes = Backbone.View.extend({
        id: 'tab-content',
        initialize: function(options) {
            var that = this;
            this.options = options;
            this.schedulerView = new SchedulerView({
                schedulerId: options.model.id
            });

            this.availabilities = new AvailabilityCollection(this.options);
            this.listenTo(this.availabilities, 'add', this.addOne);
            this.listenTo(this.availabilities, 'reset', this.addAll);
        },
        render: function() {
            var that = this;
            this.availabilities.fetch({
                reset: true,
                silent: true
            }).done(function() {
                that.$el.html(_.template(TimesTemplate, {
                    availabilities: that.availabilities,
                    moment: moment
                })).promise().done(function() {
                    that.$el.append(that.schedulerView.render().el);
                });

                that.$('.datetimepicker').datetimepicker({
                    format: 'H:mm',
                });

                that.availabilities.trigger('reset');
            })

            return this;

        },
        events: {
            'submit #new-availability-form': 'addAvailability'
        },
        addAvailability: function(e) {
            e.preventDefault();
            var availableSlot = new AvailableSlot({
                calendarId: this.options.model.id
            });
            var that = this;
            availableSlot.save($(e.target).serializeJSON(), {
                success: function(model, response) {
                    // console.log(model);
                    var parent = that.availabilities.findWhere({
                        id: model.get('DayOfWeekId')
                    });

                    parent.get('Availabilities').push(model.attributes);
                    that.addOne(parent);
                },
                error: function(model, response) {

                }
            });
        },
        addOne: function(availability) {
            var that = this;
            $('#availability-' + availability.cid).html('');

            availability.get('Availabilities').sort(function(a, b) {
                return moment(a.startTime, 'H:mm').unix() - moment(b.startTime, 'H:mm').unix();
            })

            _.each(availability.get('Availabilities'), function(slot) {
                var availableSlot = new AvailableSlot(_.extend(slot, {
                    calendarId: that.options.model.id
                }));

                that.listenTo(availableSlot, 'sync', function() {
                    that.schedulerView.render();
                });

                var view = new AvailableSlotView({
                    model: availableSlot
                });

                $('#availability-' + availability.cid).append(view.render().el);
            });
        },
        addAll: function() {
            this.availabilities.each(this.addOne, this);
        }
    });
    return CalendarTimes;
});
