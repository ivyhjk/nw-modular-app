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
