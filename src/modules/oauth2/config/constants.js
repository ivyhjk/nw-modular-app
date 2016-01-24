(function (angular) {
    'use strict';

    angular.module('App.OAuth2').constant('App.OAuth2.OAUTH2', {
        CLIENT_ID : 'elvis',
        CLIENT_SECRET : 'elvis',
        RESOURCE_SERVER : 'http://dev/angular/modulos/0.4/db',
        AUTHORIZATION_SERVER : 'http://dev/vrock/api/public'
    });
})(angular);
