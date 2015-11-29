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
