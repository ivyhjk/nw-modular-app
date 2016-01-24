(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Resource.AccessToken';

    angular
        .module(module, [
            'ngResource'
        ])
        .factory(module, AccessToken);
    ;

    AccessToken.$inject = ['$resource', 'App.OAuth2.OAUTH2'];

    function AccessToken($resource, OAUTH2) {
        var resource = '/access_token';

        return $resource(resource, null, {
            'generate' : {
                method : 'POST',
                url : OAUTH2.AUTHORIZATION_SERVER + resource,
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
