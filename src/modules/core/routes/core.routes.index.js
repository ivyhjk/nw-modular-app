(function (angular) {
	'use strict';

	angular.module('App.core').config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
                .state('app', {
                    abstract: true,
                    views : {
                    	// Global layout for views.
                        layout : {
                            templateUrl : 'layouts/default.html'
                        },
                        // Global header for views.
                        "header@app" : {
                            templateUrl : 'elements/header.html'
                        },
                        // // Global menu for views.
                        "menu@app" : {
                            templateUrl : 'elements/menu.html'
                        }
                    }
                })
                // Not found route.
                .state('app.notFound', {
                    templateUrl : 'errors/404.html'
                })
                // Home route
                .state('app.home', {
                    url : '/',
                    templateUrl : 'home/index.html'
                });
		}
	]);
})(angular);