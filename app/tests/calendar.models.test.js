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
                user = _user;
                done();
            })
        });
    });


    describe('Method create', function() {
        it('should create a calendar with valid properties', function(done) {
            models.Calendar.create({
                name: 'calendar',
                notes: 'calendar notes',
                defaultLength: 60,
                minLength: 60,
                maxLength: 60,
                UserId: 1
            }).should.not.be.rejected.notify(done);
        })
    });

    describe('Method createCalendar', function() {
        it('should not create a calendar with valid properties and not invalid availabilities', function(done) {
            models.Calendar.createCalendar({
                name: 'calendar',
                notes: 'calendar notes',
                defaultLength: 60,
                minLength: 60,
                maxLength: 60,
                UserId: 1,
                DayOfWeek: [{
                    dayOfWeek: 1,
                    Availabilities: [{
                        startTime: 900,
                        endTime: '1800'
                    }]
                }, {
                    dayOfWeek: 2,
                    Availabilities: [{
                        startTime: '900',
                        endTime: '1800'
                    }]
                }]
            }, user).should.be.rejected.notify(done);
        });

        it('should create a calendar with valid properties and availabilities', function(done) {
            models.Calendar.createCalendar({
                name: 'calendar',
                notes: 'calendar notes',
                defaultLength: 60,
                minLength: 60,
                maxLength: 60,
                UserId: 1,
                DayOfWeek: [{
                    dayOfWeek: 1,
                    Availabilities: [{
                        startTime: '9:00',
                        endTime: '18:00'
                    }]
                }, {
                    dayOfWeek: 2,
                    Availabilities: [{
                        startTime: '9:00',
                        endTime: '18:00'
                    }]
                }]
            }, user).should.not.be.rejected.notify(done);
        })

    });
    //After all the tests have run
    after(function() {

    });
});
