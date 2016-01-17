(function (window, angular) {
    'use strict';

    /**
     * Module constructor.
     *
     * @param angular $angular Angularjs instance.
     *
     * @return self
     **/
    var Module = function ($angular) {
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
    Module.prototype.register = function ($name, $requires, $config) {
    	var _this = this;

    	_this.name = $name;
    	_this.realName = _this.name.replace(/(.*)\./g, '');

    	// Paths configurations.
    	_this.paths.module = 'src/modules/' + _this.realName.toLowerCase() + '/';
    	_this.paths.views = _this.paths.module + 'view/';
    	// End paths configurations.

        // Register module.
    	_this.angular.module(_this.name, $requires, $config);

        // Configure $stateProvider for views.
    	_this.config(['$stateProvider',
    		function ($stateProvider) {
	            var baseStateProvider = $stateProvider.state;

	            $stateProvider.state = function(name, definition) {
	                if (typeof definition.templateUrl !== 'undefined') {
                        if (isNotProccessed(definition)) {
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

                        if (isNotProccessed(definition)) {
                            definition.processedByModule = true;
                        } else {
                            baseStateProvider(name, definition);
                            return this;
                        }

	                    for (key in definition.views) {
	                        value = definition.views[ key ];

	                        if (typeof value.templateUrl !== 'undefined') {
                                if (isNotProccessed(value)) {
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

                function isNotProccessed(definition)
                {
                    return typeof definition.processedByModule === 'undefined' || definition.processedByModule === false;
                }

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
    Module.prototype.config = function ($configFn) {
    	var _this = this;

    	_this.angular.module(_this.name).config($configFn);

    	return _this;
    };

    window.Module = Module;
})(window, angular);

(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App', [
        'ui.router',

        'App.Controller.HomeController',
        'App.OAuth2',
    ]);
})(angular, Module);

(function (angular, Module) {
    'use strict';

    var module = new Module(angular);

    module.register('App.OAuth2', [
        'App.OAuth2.Factory.TokenInterceptor',
        'App.OAuth2.Controller.LoginController',
        'App.OAuth2.Controller.LogoutController'
    ]);

    // angular.module('App.OAuth2', [
    //     'App.OAuth2.Controller.LoginController'
    // ]);
})(angular, Module);

(function (angular) {
    'use strict';

    var app = angular.module('App');

    app.config(Config);

    Config.$inject = ['$locationProvider'];

    function Config($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
})(angular);

(function (angular) {
    'use strict';

    angular.module('App').constant('API', {
        url : 'http://dev/vrock/api/public'
    });
})(angular);

(function (angular) {
    'use strict';

    angular.module('App').config(Http);

    Http.$inject = ['$httpProvider', 'API'];

    function Http($httpProvider, API) {
        $httpProvider.interceptors.push(function ($q, $injector) {
            var errors
                , data
                , messages;

            return {
                request: function(config) {
                    // REST API requests
                    if (config.headers.Accept.indexOf('application/json') !== -1 && config.url.indexOf('.html') === -1) {
                        config.url = API.url + config.url;
                    }

                    return config;
                },
                response: function(response) {
                    if (typeof response.data === 'object' && typeof response.data.data !== 'undefined') {
                        data = response.data.data;
                        errors = response.data.errors;
                        messages = response.data.messages;

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
                            $injector.get('$state').go('error.notFound');
                        }

                        if (typeof rejection.data.errors !== 'undefined') {
                            errors = rejection.data.errors.join("\n");

                            alert('Error!: ' + errors);
                        }
                    }

                    return $q.reject(rejection);
                }
            };
        });
    }
})(angular);

(function (angular) {
    'use strict';

    angular.module('App').config(Resource);

    Resource.$inject = ['$resourceProvider'];

    function Resource($resourceProvider) {
        // Enable resource pagination.
        $resourceProvider.defaults.actions.paginate = {
            method : 'GET',
            transformResponse : transformResponsePaginator
        };

        /**
         * Resource pagination.
         *
         * @param object $data
         * @param function $headersGetter
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
})(angular);

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

(function (angular) {
    'use strict';

    angular.module('App.OAuth2').constant('OAUTH2', {
        CLIENT_ID : 'elvis',
        CLIENT_SECRET : 'elvis',
        RESOURCE_SERVER : 'http://dev/vrock/angular/db',
        AUTHORIZATION_SERVER : 'http://dev/vrock/api/public'
    });
})(angular);

(function (angular) {
    'use strict';

    angular.module('App.OAuth2').run(Bootstrap);

    Bootstrap.$inject = ['$rootScope', '$state', 'App.OAuth2.Service.OAuth2'];

    function Bootstrap($rootScope, $state, OAuth2) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (typeof toState.access !== 'undefined' && toState.access.auth === false) {
                return;
            }

            if ( ! OAuth2.loggedIn()) {
                event.preventDefault();
                return $state.go('auth.login');
            }
        });
    }
})(angular);

(function (angular) {
    'use strict';

    angular.module('App.OAuth2').config(Token);

    Token.$inject = ['$httpProvider'];

    function Token($httpProvider) {
        $httpProvider.interceptors.push('App.OAuth2.Factory.TokenInterceptor');
    }
})(angular);

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
        ;
    }
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Factory.Session';

    angular
        .module(module, [])
        .service(module, Factory)
    ;

    Factory.$inject = ['$window'];

    function Factory ($window) {
        function Session() {
            /**
             * Storage for Session persistent data.
             *
             * @var object
             **/
            this.storage = $window.localStorage;

            /**
             * Expire time.
             *
             * @var bigint
             **/
            this.expires_in = 0;

            /**
             * Started date.
             *
             * @var Date
             **/
            this.started_at = new Date();

            /**
             * Expiration date.
             *
             * @var Date
             **/
            this.expires_at = new Date();

            /**
             * Token type (ex: Bearer, JWT, etc).
             *
             * @var string
             **/
            this.token_type = null;

            /**
             * Access token.
             *
             * @var string
             **/
            this.access_token = null;

            var session = this.get('session');

            if (session) {
                this.setData(session);
            }
        };

        /**
         * Get an item from storage.
         *
         * @param $item Item key.
         *
         * @return string
         **/
        Session.prototype.get = function ($item) {
            return this.storage.getItem($item);
        };

        /**
         * Set a value on storage.
         *
         * @param string $key
         * @param string $value
         *
         * @return self
         **/
        Session.prototype.set = function ($key, $value) {
            this.storage.setItem($key, $value);

            return this;
        };

        /**
         * Check if session is or not expired.
         *
         * @return boolean
         **/
        Session.prototype.expired = function () {
            if ( ! this.expires_at) {
                return true;
            }

            return this.getUnixTime() > this.expires_at.getTime();
        };

        /**
         * Get Unix time.
         *
         * @return bigint
         **/
        Session.prototype.getUnixTime = function () {
            return (new Date()).getTime();
        }

        /**
         * Flush all session data and return a new clean entity.
         *
         * @return self
         **/
        Session.prototype.flush = function () {
            this.storage.clear();

            return new Session();
        };

        /**
         * Save session in storage, for persistence.
         *
         * @return self
         **/
        Session.prototype.save = function() {
            this.set('session', JSON.stringify(this));

            return this;
        };

        /**
         * Set data for session.
         *
         * @param object $data
         *
         * @return self
         **/
        Session.prototype.setData = function($data) {
            this.token_type = $data.token_type;
            this.access_token = $data.access_token;
            this.expires_in = $data.expires_in;

            if (typeof $data.started_at !== 'undefined') {
                this.started_at = $data.started_at;
            }

            if (typeof this.expires_in === 'string') {
                this.expires_in = new Date(this.expires_in);
            }

            if (typeof this.started_at === 'string') {
                this.started_at = new Date(this.started_at);
            }

            var expires_in = this.expires_in * 1000;

            this.expires_at = new Date(this.started_at.getTime() + expires_in);

            return this;
        };

        /**
         * Get data from storage.
         *
         * @return object
         **/
        Session.prototype.getData = function () {
            var data = this.get('session');

            return JSON.parse(data);
        };

        /**
         * Check if current session is active.
         *
         * @return boolean
         **/
        Session.prototype.isActive = function() {
            var data = this.getData();

            if ( ! data) {
                return false;
            }

            if ( ! this.access_token) {
                this.setData(data);
            }

            return this.expired() === false;
        };

        return Session;
    };
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Factory.TokenInterceptor';

    angular
        .module(module, [])
        .factory(module, TokenInterceptor)
    ;

    TokenInterceptor.$inject = ['$q', '$window', '$injector'];

    function TokenInterceptor($q, $window, $injector) {
    	function needAccess () {
            var currentState = $injector.get('$state').current;

    		return typeof currentState.access === 'undefined' || currentState.access.auth === true;
    	};

        return {
            request: function (config) {
                if (config.headers.Accept.indexOf('application/json') != -1) {
		            if ( ! needAccess()) {
		            	return config;
		            }

		            var session = $window.localStorage.getItem('session');

		            if (session) {
			            session = JSON.parse(session);

			            config.headers.Authorization = 'Bearer ' + session.access_token;
		            }
                }

	            return config;
	        },
	        responseError : function (rejection) {
	        	if (typeof rejection.data === 'undefined') {
	        		return $q.rejection(rejection);
	        	}

	        	if (needAccess()) {
	        		if (rejection.status === 401) { // 401 - unauthorized.
		        		$window.localStorage.clear();
		        		return $injector.get('$state').go('auth.login');
	        		}
	        	}

                return $q.reject(rejection);
	        }
        };
    }
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Service.OAuth2';

    angular
        .module(module, [
            'App.OAuth2.Factory.Session',
            'App.OAuth2.Resource.AccessToken'
        ])
        .service(module, OAuth2);

    OAuth2.$inject = ['$state', 'App.OAuth2.Resource.AccessToken', 'App.OAuth2.Factory.Session'];

    function OAuth2 ($state, AccessToken, Session) {
        /**
         * Angular state provider.
         *
         * @var object
         **/
        this.$state = $state;

        /**
         * AccessToken angular resource.
         *
         * @var AccessToken
         **/
        this.AccessToken = AccessToken;

        /**
         * Session manager.
         *
         * @var SessionService
         **/
        this.Session = new Session();
    }

    OAuth2.prototype.login = function (data) {
        var _this = this;

        if (_this.Session.isActive()) {
            return _this.$state.go('app.home');
        }

        var Auth = new _this.AccessToken(data);

        _this.AccessToken.generate(Auth, function ($session) {
            _this.Session
                .setData($session)
                .save();

            _this.$state.go('app.home');
        });
    };

    /**
     * Check if a user is logged in.
     *
     * @return boolean
     **/
    OAuth2.prototype.loggedIn = function () {
        if (this.Session.isActive()) {
            return true;
        }

        this.Session = this.Session.flush();

        return false;
    };
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Resource.AccessToken';

    angular
        .module(module, [
            'ngResource'
        ])
        .factory(module, AccessToken);
    ;

    AccessToken.$inject = ['$resource', 'OAUTH2'];

    function AccessToken($resource, OAUTH2) {
        return $resource('/access_token', null, {
    		'generate' : {
    			method : 'POST',
    			transformRequest : function (data, headersGetter) {
    				data.grant_type = 'password';
    				data.client_id = OAUTH2.CLIENT_ID;
                    data.client_secret = OAUTH2.CLIENT_SECRET;
                    data.scopes = ['basic'];

    				return JSON.stringify(data);
    			}
    		}
    	});
    }
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.Controller.HomeController';

    angular
        .module(module, [])
        .controller(module, HomeController)
    ;

    HomeController.$inject = [];

    function HomeController() {
        
    }
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.LoginController';

    angular
        .module(module, [
            'App.OAuth2.Service.OAuth2'
        ])
        .controller(module, LoginController)
    ;

    LoginController.$inject = ['$state', 'App.OAuth2.Service.OAuth2'];

    function LoginController($state, OAuth2) {
        if (OAuth2.loggedIn() === true) {
            alert('You are already legged in!');

            return $state.go('app.home');
        }

        var vm = this;

        vm.auth = {
        	username : null,
        	password : null,
	        remember : false
        };

        vm.do = function () {
            if ( ! vm.auth.username) {
        		alert('A username is required');
        		focus('#LoginUsername');
        		return false;
        	}

        	if ( ! vm.auth.password) {
        		alert('A password is required');
        		focus('#LoginPassword');
        		return false;
        	}

            OAuth2.login(vm.auth, function (error) {
                vm.auth.password = null;
                focus('#LoginPassword');

                if (error) {
                    alert(error);
                }
            });
        };

        /**
         * Focus an input.
         *
         * @param string $selector
         *
         * @return void
         **/
        function focus($selector) {
        	var element = document.querySelector($selector);
        	angular.element(element)[0].focus();
        }
    }
})(angular);

(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.LogoutController';

    angular
        .module(module, [])
        .controller(module, LogoutController);
    ;

    LogoutController.$inject = ['$state', 'App.OAuth2.Service.OAuth2'];

    function LogoutController($state, OAuth2) {
        OAuth2.Session.flush();

        return $state.go('auth.login');
    }
})(angular);
