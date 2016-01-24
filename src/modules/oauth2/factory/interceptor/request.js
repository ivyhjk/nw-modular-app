(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Factory.Interceptor.Request';

    angular
        .module(module, [])
        .factory(module, Request)
    ;

    Request.$inject = ['App.OAuth2.OAUTH2'];

    function Request(OAUTH2) {
        return {
            request: function(config) {
                // REST API requests
                if (
                    config.headers.Accept.indexOf('application/json') !== -1 // Just catch application/json mimetype requests.
                    && config.url.indexOf('.html') === -1 // Doesn't catch html files or template request.
                    && config.url.indexOf('http://') !== 0 // Doesn't catch direct HTTP request.
                    && config.url.indexOf('https://') !== 0 // Doesn't catch direct HTTPS request.
                )
                {
                    config.url = OAUTH2.RESOURCE_SERVER + config.url;
                }

                return config;
            }
        };
    }
})(angular);
