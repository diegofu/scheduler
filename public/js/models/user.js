define(['underscore', 'backbone'], function(_, Backbone) {
    var User = Backbone.Model.extend({
        url: 'users/me',
    });

    return User;
});