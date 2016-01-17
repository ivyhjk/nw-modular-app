(function (angular) {
    'use strict';

    angular.module('App.OAuth2').run(Bootstrap);

    Bootstrap.$inject = ['$rootScope', '$state', 'App.OAuth2.Service.OAuth2'];

    function Bootstrap($rootScope, $state, OAuth2) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (typeof toState.access !== 'undefined' && toState.access.auth === false) {
                return;
            }

            if ( ! OAuth2.loggedIn()) {
                event.preventDefault();
                return $state.go('auth.login');
            }
        });
    }
})(angular);
