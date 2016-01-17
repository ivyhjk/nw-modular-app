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
