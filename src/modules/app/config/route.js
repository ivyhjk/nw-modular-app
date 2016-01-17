(function (angular) {
    'use strict';

    angular.module('App').config(Routes);

    Routes.$inject = ['$stateProvider'];

    function Routes($stateProvider) {
        $stateProvider
            .state('app', {
                abstract : true,
                views : {
                    // Global layout for auth views.
                    layout : {
                        templateUrl : 'layouts/default.html'
                    }
                }
            })
            .state('app.home', {
                url : '/',
                templateUrl : 'home/index.html',
                access : {
                    auth : true // Free access
                }
            })
        ;

        // Errors
        $stateProvider
            .state('error', {
                abstract : true,
                views : {
                    layout : {
                        templateUrl : 'layouts/blank.html'
                    }
                }
            })
            // Not found route.
            .state('error.notFound', {
                url : '/404',
                templateUrl : 'errors/404.html'
            });
    }
})(angular);
