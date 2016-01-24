(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Factory.Interceptor.Token';

    angular
        .module(module, [])
        .factory(module, Token)
    ;

    Token.$inject = ['$q', '$window', '$injector'];

    function Token($q, $window, $injector) {
        function needAccess () {
            var currentState = $injector.get('$state').current;

            return typeof currentState.access === 'undefined' || currentState.access.auth === true;
        };

        return {
            request: function (config) {
                if (config.headers.Accept.indexOf('application/json') != -1) {
                    if ( ! needAccess()) {
                        return config;
                    }

                    var session = $window.localStorage.getItem('session');

                    if (session) {
                        session = JSON.parse(session);

                        config.headers.Authorization = 'Bearer ' + session.access_token;
                    }
                }

                return config;
            },
            responseError : function (rejection) {
                if (typeof rejection.data === 'undefined') {
                    return $q.rejection(rejection);
                }

                if (needAccess()) {
                    if (rejection.status === 401) { // 401 - unauthorized.
                        $window.localStorage.clear();
                        return $injector.get('$state').go('auth.login');
                    }
                }

                return $q.reject(rejection);
            }
        };
    }
})(angular);
