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
