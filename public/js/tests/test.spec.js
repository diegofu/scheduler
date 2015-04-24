define(['models/calendar', 'jquery', 'underscore'], function(Calendar, $, _) {
    describe("A test suite", function() {
        beforeEach(function() {});
        afterEach(function() {});
        it('Default length check', function() {
            var calendar = new Calendar();
            expect(calendar.get('defaultLength')).to.equal(60);
        });


        it('SlotBooked check', function() {
            var calendar = new Calendar();
            calendar.set('Bookings', [{
                startTime: 100,
                endTime: 200
            }]);

            calendar.set({
                Bookings: [{
                    startTime: 60 * 60,
                    endTime: 2 * 60 * 60
                }],
                id: 1
            })

            expect(calendar.slotBooked(0)).to.be.false;
            expect(calendar.slotBooked(1800)).to.be.true;
            expect(calendar.slotBooked(3600)).to.be.true;
            expect(calendar.slotBooked(7200)).to.be.false;
        })
    });
})
