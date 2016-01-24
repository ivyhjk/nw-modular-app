(function (angular) {
    'use strict';

    angular.module('App.OAuth2').config(Routes);

    Routes.$inject = ['$urlRouterProvider', '$stateProvider'];

    function Routes($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('auth', {
                abstract : true,
                views : {
                    // Global layout for auth views.
                    layout : {
                        templateUrl : 'layouts/default.html'
                    }
                }
            })
            .state('auth.login', {
                url : '/auth/login',
                templateUrl : 'auth/login.html',
                access : {
                    auth : false // Free access
                }
            })
            .state('auth.logout', {
                url : '/auth/logout',
                controller : 'App.OAuth2.Controller.LogoutController',
            })
            .state('auth.recover', {
                url : '/auth/recover',
                templateUrl : 'auth/recover.html',
                access : {
                    auth : false
                }
            })
            .state('auth.signup', {
                url : '/auth/signup',
                templateUrl : 'auth/signup.html',
                access : {
                    auth : false
                }
            })
        ;
    }
})(angular);
