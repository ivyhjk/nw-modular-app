(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App.OAuth2', [
        'App.OAuth2.Factory.Interceptor.Token',
        'App.OAuth2.Factory.Interceptor.Request',
        'App.OAuth2.Resource.User',
        'App.OAuth2.Controller.LoginController',
        'App.OAuth2.Controller.LogoutController',
        'App.OAuth2.Controller.RecorverController',
        'App.OAuth2.Controller.SignUpController'
    ]);
})(angular, Module);
