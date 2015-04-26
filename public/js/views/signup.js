define(['underscore', 'backbone', 'models/user', 'text!templates/SignupTemplate.html', 'serializejson'], function(_, Backbone, User, SignupTemplate) {
    var Signin = Backbone.View.extend({
        el: $('#content'),
        initialize: function() {},
        render: function() {
            this.$el.html(_.template(SignupTemplate));
        },
        events: {
            'submit form#signup-form': 'signup',
            'keyup #confirm-password': 'confirmPassword'
        },
        confirmPassword: _.debounce(function(e) {
            if(e.target.value !== document.getElementById('password').value) {
                $(e.target).parent('.form-group').addClass('has-error');
            } else {
                $(e.target).parent('.form-group').removeClass('has-error');
            }
        }, 1000, false),
        signup: function(e) {
            e.preventDefault();
            var user = new User();
            user.save($(e.target).serializeJSON(), {
                success: function(user, response) {
                    window.location.href = '/dashboard';
                },
                error: function(user, response) {
                    console.log(user);
                    console.log(response);
                }
            });
        }
    });

    return Signin;
});
