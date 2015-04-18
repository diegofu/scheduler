'use strict';

module.exports = function(app) {
    app.route('/dashboard').get(function(req, res) {
    	res.render('dashboard', {
            title: 'My Dashboard'
        });
        // if (req.user) {
        //     res.render('dashboard', {
        //         title: 'My Dashboard'
        //     });
        // } else {
        //     res.redirect('/#/users/signin');
        // }

    });
};
