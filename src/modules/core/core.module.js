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
