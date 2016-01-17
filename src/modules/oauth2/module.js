(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App.OAuth2', [
        'App.OAuth2.Factory.TokenInterceptor',
        'App.OAuth2.Controller.LoginController',
        'App.OAuth2.Controller.LogoutController'
    ]);

    // angular.module('App.OAuth2', [
    //     'App.OAuth2.Controller.LoginController'
    // ]);
})(angular, Module);
