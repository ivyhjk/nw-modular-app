(function (angular) {
    'use strict';

    var app = angular.module('App');

    app.config(Config);

    Config.$inject = ['$locationProvider'];

    function Config($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
})(angular);
