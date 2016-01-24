(function (angular) {
    'use strict';

    var module = 'App.Controller.HomeController';

    angular
        .module(module, [
            'ngResource'
        ])
        .controller(module, HomeController)
    ;

    HomeController.$inject = [];

    function HomeController() {

    }
})(angular);
