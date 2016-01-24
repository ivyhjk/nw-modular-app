(function (angular) {
    'use strict';

    angular.module('App').config(Http);

    Http.$inject = ['$httpProvider'];

    function Http($httpProvider) {
        // $httpProvider.interceptors.push('App.Factory.Interceptor.Request');
        $httpProvider.interceptors.push('App.Factory.Interceptor.Response');
        $httpProvider.interceptors.push('App.OAuth2.Factory.Interceptor.Request');
    }
})(angular);
