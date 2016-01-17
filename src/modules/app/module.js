(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App', [
        'ui.router',

        'App.Controller.HomeController',
        'App.OAuth2',
    ]);
})(angular, Module);
