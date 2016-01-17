(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.LogoutController';

    angular
        .module(module, [])
        .controller(module, LogoutController);
    ;

    LogoutController.$inject = ['$state', 'App.OAuth2.Service.OAuth2'];

    function LogoutController($state, OAuth2) {
        OAuth2.Session.flush();

        return $state.go('auth.login');
    }
})(angular);
