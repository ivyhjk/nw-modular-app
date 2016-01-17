(function (angular) {
    'use strict';

    angular.module('App.OAuth2').config(Token);

    Token.$inject = ['$httpProvider'];

    function Token($httpProvider) {
        $httpProvider.interceptors.push('App.OAuth2.Factory.TokenInterceptor');
    }
})(angular);
