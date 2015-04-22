require.config({
    paths: {
        templates: '../templates',
        jquery: '../lib/jquery/dist/jquery',
        underscore: '../lib/underscore-amd/underscore',
        backbone: '../lib/backbone-amd/backbone',
        text: '../lib/text/text',
        bootstrap: '../lib/bootstrap-sass/assets/javascripts/bootstrap',
        serializejson: '../lib/jquery.serializeJSON/jquery.serializejson.min',
        moment: '../lib/moment/moment',
        datetimepicker: '../lib/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        serializejson: {
            deps: ['jquery']
        },
        datetimepicker: {
            deps: ['jquery', 'bootstrap', 'moment']
        }
    }
});
