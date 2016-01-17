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
