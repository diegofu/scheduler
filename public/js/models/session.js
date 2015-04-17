define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Session = Backbone.Model.extend({
        url: '/session',
        initialize: function() {
        },
        login: function(credentials) {
            var that = this;
            var login = $.ajax({
                url: '/users/signin',
                data: credentials,
                type: 'POST'
            });
            login.done(function(response) {
                that.set('authenticated', true);
                that.set('user', JSON.stringify(response.user));
                if (that.get('redirectFrom')) {
                    var path = '/home';
                    Backbone.history.navigate(path, {
                        trigger: true
                    });
                } else {
                	$('#authentication').html('hahaha');
                    Backbone.history.navigate('/home', {
                        trigger: true
                    });
                }
            });
            login.fail(function() {
                Backbone.history.navigate('users/signin', {
                    trigger: true
                });
            });
        },
    });

    return Session;
});
