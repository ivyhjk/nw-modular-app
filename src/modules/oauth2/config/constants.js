(function (angular) {
    'use strict';

    angular.module('App.OAuth2').constant('OAUTH2', {
        CLIENT_ID : 'elvis',
        CLIENT_SECRET : 'elvis',
        RESOURCE_SERVER : 'http://dev/vrock/angular/db',
        AUTHORIZATION_SERVER : 'http://dev/vrock/api/public'
    });
})(angular);
