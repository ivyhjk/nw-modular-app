(function (window, angular) {
	'use strict';

    /**
     * AppModule constructor.
     *
     * @param angular $angular Angularjs instance.
     *
     * @return self
     **/
    var AppModule = function ($angular) {
        /**
         * Contain all available paths for views. 
         *
         * @var Object
         **/
    	this.paths = {
            "module" : null,
            "views" : null
        };

        /**
         * Module name.
         *
         * @var string
         **/
    	this.name = null;

        /**
         * Module real name, or short name.
         *
         * @var string
         **/
    	this.realName = null;

        /**
         * Angularjs instance.
         *
         * @var angular
         **/
    	this.angular = $angular;

    	return this;
    };

    /**
     * Register a module with custom configurations.
     *
     * @param string $name Module name.
     * @param array $requires Module initial requirements.
     * @param array $config Module initial configurations.
     *
     * @return self
     **/
    AppModule.prototype.registerModule = function ($name, $requires, $config) {
    	var _this = this;

    	_this.name = $name;
    	_this.realName = _this.name.replace(/(.*)\./g, '');
    		
    	// Paths configurations.
    	_this.paths.module = 'src/modules/' + _this.realName + '/';
    	_this.paths.views = _this.paths.module + 'views/';
    	// End paths configurations.

        // Register module.
    	_this.angular.module(_this.name, $requires, $config);

        // Configure $stateProvider for views.
    	_this.config(['$stateProvider',
    		function ($stateProvider) {
	            var baseStateProvider = $stateProvider.state;

	            $stateProvider.state = function(name, definition) {
	                if (typeof definition.templateUrl !== 'undefined') {
                        if (typeof definition.processedByModule === 'undefined' || definition.processedByModule === false) {
                            definition.templateUrl = _this.paths.views + definition.templateUrl;
                            definition.processedByModule = true;
                        } else {
                            setProcessedValues(definition);
                            baseStateProvider(name, definition);

                            return this;
                        }
	                }

	                if (typeof definition.views !== 'undefined') {
	                    var key = null;
	                    var value = null;

                        if (typeof definition.processedByModule === 'undefined' || definition.processedByModule === false) {
                            definition.processedByModule = true;
                        } else {
                            baseStateProvider(name, definition);
                            return this;
                        }

	                    for (key in definition.views) {
	                        value = definition.views[ key ];

	                        if (typeof value.templateUrl !== 'undefined') {
                                if (typeof value.processedByModule === 'undefined' || value.processedByModule === false) {
                                    value.templateUrl = _this.paths.views + value.templateUrl;

                                    setProcessedValues(value);
                                } else {
                                    continue;
                                }
	                        }
	                    }
	                } else {
                        setProcessedValues(definition);
                    }

	                baseStateProvider(name, definition);

	                return this;
	            };

                function setProcessedValues(value) {
                    value.processedByModule = true;
                    
                    if (typeof value.access === 'undefined') {
                        value.access = {
                            auth : true
                        };
                    }

                    return value;
                }
    		}
    	]);

    	return _this;
    };

    /**
     * Configure a module. Maybe is useless... You can use: angular.module('Namespace.Name').config();
     *
     * @param array $configFn
     *
     * @return self
     **/
    AppModule.prototype.config = function ($configFn) {
    	var _this = this;

    	_this.angular.module(_this.name).config($configFn);

    	return _this;
    };

    window.AppModule = AppModule;
})(window, angular);

(function (angular, AppModule) {
	'use strict';

	var CoreModule = new AppModule(angular);

    CoreModule.registerModule('App.core', [
    	'ui.router',
        'ui.router.util',
        'ui.bootstrap',
        'ngResource',

        'App.design'
    ]);


    // angular.module('App.core').run(['Menu',
    // 	function (Menu) {
    //     	Menu.addItem('Home', 'fa fa-home', '#/', 100);
    //     	Menu.addItem('asd', 'fa fa-home', '#/asd', 99);
    // 	}
    // ]);

    angular.module('App.core').constant('APISERVER', {
        url : 'http://dev/xxx/api/public'
    });

    // Configure $resourceProvider for custom queries to REST services.
    angular.module('App.core').config(['$resourceProvider',
        function ($resourceProvider) {

            // Enable resource pagination.
            $resourceProvider.defaults.actions.paginate = {
                method : 'GET',
                transformResponse : transformResponsePaginator
            };

            // Create a new register.
            $resourceProvider.defaults.actions.save  = {
                method : 'POST',
                transformResponse : transformResponseCommon
            };


            function transformResponseCommon($data, $headersGetter)
            {
                var json_data = JSON.parse($data);

                return json_data.data;
            }

            /**
             * Resource pagination.
             *
             * @param object $data
             * @param callback $headersGetter
             *
             * @return Object
             **/
            function transformResponsePaginator($data, $headersGetter)
            {
                var json_data = JSON.parse($data);

                json_data.data.pages = [];

                if (json_data.data.total_pages > 1) {
                    for (var i = 1; i <= json_data.data.total_pages; ++i) {
                        json_data.data.pages.push(i);
                    }
                }

                return json_data.data;
            }
        }
    ]);
})(angular, AppModule);

(function (angular, AppModule) {
	'use strict';

	var CoreModule = new AppModule(angular);

    CoreModule.registerModule('App.design', []);
})(angular, AppModule);

(function (angular) {
    'use strict';

    angular.module('App.core').config(CoreConfig);

    CoreConfig.$inject = ['$httpProvider', 'APISERVER'];

    function CoreConfig($httpProvider, APISERVER) {
        $httpProvider.interceptors.push(function ($q, $injector) {
            return {
                request: function(config) {
                    // REST API requests
                    if (config.headers.Accept.indexOf('application/json') != -1) {
                        config.url = APISERVER.url + config.url;
                    }

                    return config;
                },
                response: function(response) {
                    if (typeof response.data === 'object' && typeof response.data.data !== 'undefined') {
                        var data = response.data.data;
                        var errors = response.data.errors;
                        var messages = response.data.messages;

                        if (errors.length > 0) {
                            if (Array.isArray(errors)) {
                                errors = errors.join("\n");
                            }

                            alert('Error!: ' + errors);
                        }

                        if (messages.length > 0) {
                            messages = messages.join("\n");

                            alert(messages);
                        }

                        response.data = data;
                    }

                   return response;
                },
                responseError : function (rejection) {
                    if (typeof rejection.status !== 'undefined') {
                        if (rejection.status === 404) {
                            return $injector.get('$state').go('app.notFound');
                        }
                    }

                    return $q.reject(rejection);
                }
            };
        })
    }
})(angular);

(function (angular) {
    'use strict';

    angular.module('App.core').controller('HeaderController', HeaderController);

    HeaderController.$inject = [];

    function HeaderController () {
        var vm = this;
    }
})(angular);

(function(angular) {
    'use strict';

    angular.module('App.core').controller('MenuController', MenuController);

    MenuController.$inject = ['Menu'];

    function MenuController (Menu) {
        var vm = this;

        vm.items = Menu.getItems();
    }

})(angular);

(function(angular) {
    'use strict';

    angular.module('App.core').controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope'];

    function SidebarController ($rootScope) {
        var vm = this;

        vm.collapsedMenu = $rootScope.collapsedMenu = false;
    }

})(angular);

(function (angular) {
	'use strict';

	angular.module('App.core').factory('Menu', MenuFactory);

    MenuFactory.$inject = [];

    function MenuFactory () {
    	var vm = this;

    	// Menu items.
    	vm.items = [];

        /**
         * Menu item default priority.
         *
         * @var int
         **/
        vm.defaultPriority = -1;

        /**
         * Add a new menu item.
         *
         * @param string $name Menu item name
         * @param string $icon Menu item icon
         * @param string $source Menu item source, href.
         * @param string $priority Menu item priority, by default the application sort menus in descendent order.
         *
         * @return MenuFactory
         **/
    	var addItem = function ($name, $icon, $source, $priority) {
            if (typeof $priority === 'undefined') {
                $priority = vm.defaultPriority;
            }

    		var item = {
    			name : $name,
    			icon : $icon,
    			source : $source,
                priority : $priority
    		};

    		vm.items.push(item);

            return vm;
    	};

    	return {
    		addItem : addItem,
    		getItems : function () {
                vm.items.sort(function (a, b) {
                    return b.priority - a.priority; // order by priority, descendent.
                });

    			return vm.items;
    		}
    	};
    }
})(angular);
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