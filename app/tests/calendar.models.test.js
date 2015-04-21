'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    models = require('../models');

chai.use(chaiAsPromised);
chai.should();


var logOutput = '\n';
function log(msg) {
    logOutput += msg + '\n';
}

// Load model definitions
// models = require('../../models')(sequelize);

// Run model tests
describe('Model tests', function () {
    // Recreate the database after each test to ensure isolation
    beforeEach(function(done) {
        models.sequelize.sync({
            force: true
        }).success(function() {
            models.User.create({
                username: 'username',
                password: 'password'
            }).then(function(user) {
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
                maxlength: 60,
                UserId: 1
            }).should.not.be.rejected.notify(done);
        })
    });

    describe('Method createCalendar', function() {
        it('should create a calendar with valid properties and availabilities', function(done) {
            models.Calendar.createCalendar({
                name: 'calendar',
                notes: 'calendar notes',
                defaultLength: 60,
                minLength: 60,
                maxlength: 60,
                UserId: 1,
                Availabilities: [
                    {dayOfWeek: 1}
                ]
            }).should.not.be.rejected.notify(done);
        })
    });
    //After all the tests have run, output all the sequelize logging.
    after(function () {
        console.log(logOutput);
    });
    // require('./article_model')(sequelize, models);
});