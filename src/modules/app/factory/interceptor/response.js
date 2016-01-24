(function (angular) {
    'use strict';

    var module = 'App.Factory.Interceptor.Response';

    angular
        .module(module, [])
        .factory(module, Response)
    ;

    Response.$inject = ['$q', '$injector'];

    function Response($q, $injector) {
        var errors
           , data
           , messages;

        return {
            response: function(response) {
                if (typeof response.data === 'object' && typeof response.data.data !== 'undefined') {
                    data = response.data.data;
                    errors = response.data.errors;
                    messages = response.data.messages;

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
                        $injector.get('$state').go('error.notFound');
                    }

                    if (typeof rejection.data.errors !== 'undefined') {
                        errors = rejection.data.errors.join("\n");

                        alert(errors);
                    }
                }

                return $q.reject(rejection);
            }
        };
    }
})(angular);
