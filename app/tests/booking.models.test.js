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
        this.timeout(8000);
        models.sequelize.sync({
            force: true
        }).then(function() {
            models.User.create({
                email: 'email@test.com',
                firstname: 'firstname',
                lastname: 'lastname',
                password: 'password',
                provider: 'google'
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
                });
            });
        });
    });

    describe('Method create', function() {
        it('should create a booking with valid properties', function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 60,
                endTime: 60,
                email: 'test1@test.com',
                CalendarId: 1
            }).should.not.be.rejected.notify(done);
        })
    });

    describe('Method create duplicates', function() {
        beforeEach(function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 60,
                endTime: 120,
                email: 'test2@test.com',
                CalendarId: 1
            }).then(function(booking) {
                done();
            });
        });

        it('should not create a booking with same time slot', function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 60,
                endTime: 120,
                email: 'test3@test.com',
                CalendarId: 1
            }).should.be.rejected.notify(done);
        });

        it('should not create a booking with overlapping slots', function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 90,
                endTime: 150,
                email: 'test3@test.com',
                CalendarId: 1
            }).should.be.rejected.notify(done);
        });

        it('should not create a booking with slots inside the duration', function(done) {
            models.Booking.create({
                name: 'calendar',
                notes: 'calendar notes',
                startTime: 70,
                endTime: 80,
                email: 'test3@test.com',
                CalendarId: 1
            }).should.be.rejected.notify(done);
        });
    });

    //After all the tests have run
    after(function() {

    });
});
