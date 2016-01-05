(function (angular) {
    'use strict';

    angular.module('App.core').config(CoreConfig);

    CoreConfig.$inject = ['$httpProvider', 'APISERVER'];

    function CoreConfig($httpProvider, APISERVER) {
        $httpProvider.interceptors.push(function ($q, $injector) {
            return {
                request: function(config) {
                    // REST API JSON requests
                    if (config.headers.Accept.indexOf('application/json') != -1 && config.url.indexOf('.html') == -1) {
                        config.url = APISERVER.url + config.url;
                    }

                    return config;
                },
                response: function(response) {
                    if (typeof response.data === 'object' && typeof response.data.data !== 'undefined') {
                        var data = response.data.data;
                        var errors = response.data.errors;
                        var messages = response.data.messages;

                        if (errors.length > 0) {
                            if (Array.isArray(errors)) {
                                errors = errors.join("\n");
                            }

                            alert('Error!: ' + errors);
                        }

                        if (messages.length > 0) {
                            messages = messages.join("\n");

                            alert(messages);
                        }

                        response.data = data;
                    }

                   return response;
                },
                responseError : function (rejection) {
                    if (typeof rejection.status !== 'undefined') {
                        if (rejection.status === 404) {
                            return $injector.get('$state').go('app.notFound');
                        }
                    }

                    return $q.reject(rejection);
                }
            };
        })
    }
})(angular);
