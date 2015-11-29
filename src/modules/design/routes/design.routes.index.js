(function (angular) {
	'use strict';

	angular.module('App.design').config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
                .state('design', {
                    abstract: true,
                    views : {
                        // Global layout for views.
                        layout : {
                            templateUrl : 'layouts/default.html'
                        },
                        // Global header for views.
                        "header@design" : {
                            templateUrl : 'elements/header.html'
                        },
                        // // Global menu for views.
                        "menu@app" : {
                            templateUrl : 'elements/menu.html'
                        }
                    }
                })
                // Not found route.
                .state('design.notFound', {
                    templateUrl : 'errors/404.html'
                })
                // Home route
                .state('design.home', {
                    url : '/design',
                    templateUrl : 'home/index.html'
                });
            // $stateProvider
            //     .state('app.design', {
            //         abstract: true,
            //         views : {
            //             // Global layout for views.
            //             layout : {
            //                 templateUrl : 'layouts/default.html'
            //             },
            //             // Global header for views.
            //             "header" : {
            //                 templateUrl : 'elements/header.html'
            //             },
            //             // // Global menu for views.
            //             "menu@app" : {
            //                 templateUrl : 'elements/menu.html'
            //             }
            //         }
            //     })
            //     // Not found route.
            //     .state('app.design.notFound', {
            //         templateUrl : 'errors/404.html'
            //     })
            //     // Home route
            //     .state('app.design.home', {
            //         url : '/design',
            //         templateUrl : 'home/index.html'
            //     });
		}
	]);
})(angular);