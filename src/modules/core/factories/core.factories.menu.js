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