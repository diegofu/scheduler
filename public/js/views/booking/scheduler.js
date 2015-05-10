define([
    'underscore',
    'backbone',
    'moment',
    'models/scheduler',
    'text!templates/Bookings/SchedulerTemplate.html'
], function(_, Backbone, moment, Scheduler, SchdulerTemplate) {
    var Preview = Backbone.View.extend({
        id: 'scheduler-content',
        className: 'col-md-12',
        initialize: function(options) {
            this.scheduler = new Scheduler({id: options.schedulerId});
        },
        render: function() {
            var that = this;
            this.scheduler.fetch().done(function() {
                var minLength = _.min([that.scheduler.get('defaultLength'), that.scheduler.get('minLength'), that.scheduler.get('maxLength')]);
                that.$el.html(_.template(SchdulerTemplate, {
                    scheduler: that.scheduler,
                    moment: moment,
                    minLength: minLength,
                }));
            });

            return this;
        }
    });

    return Preview;
});
