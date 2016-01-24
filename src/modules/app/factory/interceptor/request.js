(function (angular) {
    'use strict';

    var module = 'App.Factory.Interceptor.Request';

    angular
        .module(module, [])
        .factory(module, Request)
    ;

    Request.$inject = ['App.API'];

    function Request(API) {
        return {
            request: function(config) {
                // REST API requests
                if (config.headers.Accept.indexOf('application/json') !== -1 && config.url.indexOf('.html') === -1) {
                    config.url = API.url + config.url;
                }

                return config;
            }
        };
    }
})(angular);
