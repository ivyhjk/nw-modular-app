(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App', [
        'ui.router',

        'App.Factory.Interceptor.Request',
        'App.Factory.Interceptor.Response',
        'App.Controller.HomeController',

        'App.OAuth2',
    ]);
})(angular, Module);
