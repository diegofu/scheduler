'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    models = require('../models');

chai.use(chaiAsPromised);
chai.should();

var user = 'user';
// Run model tests
describe('Model tests', function() {
    // Recreate the database after each test to ensure isolation
    beforeEach(function(done) {
        models.sequelize.sync({
            force: true
        }).success(function() {
            models.User.create({
                username: 'username',
                password: 'password'
            }).then(function(_user) {
                models.Calendar.create({
                    name: 'calendar',
                    notes: 'calendar notes',
                    defaultLength: 60,
                    minLength: 60,
                    maxLength: 60,
                    UserId: 1
                }).then(function(calendar) {
                    done();
                })
            })
        });
    });


    describe('Method create', function() {
        it('should create a booking with valid properties', function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 60,
                endTime: 60,
                email: 'test@test.com',
                CalendarId: 1
            }).should.not.be.rejected.notify(done);
        })
    });

    //After all the tests have run
    after(function() {

    });
});
