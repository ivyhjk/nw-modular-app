(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Factory.Session';

    angular
        .module(module, [])
        .service(module, Factory)
    ;

    Factory.$inject = ['$window'];

    function Factory ($window) {
        function Session() {
            /**
             * Storage for Session persistent data.
             *
             * @var object
             **/
            this.storage = $window.localStorage;

            /**
             * Expire time.
             *
             * @var bigint
             **/
            this.expires_in = 0;

            /**
             * Started date.
             *
             * @var Date
             **/
            this.started_at = new Date();

            /**
             * Expiration date.
             *
             * @var Date
             **/
            this.expires_at = new Date();

            /**
             * Token type (ex: Bearer, JWT, etc).
             *
             * @var string
             **/
            this.token_type = null;

            /**
             * Access token.
             *
             * @var string
             **/
            this.access_token = null;

            var session = this.get('session');

            if (session) {
                this.setData(session);
            }
        };

        /**
         * Get an item from storage.
         *
         * @param $item Item key.
         *
         * @return string
         **/
        Session.prototype.get = function ($item) {
            return this.storage.getItem($item);
        };

        /**
         * Set a value on storage.
         *
         * @param string $key
         * @param string $value
         *
         * @return self
         **/
        Session.prototype.set = function ($key, $value) {
            this.storage.setItem($key, $value);

            return this;
        };

        /**
         * Check if session is or not expired.
         *
         * @return boolean
         **/
        Session.prototype.expired = function () {
            if ( ! this.expires_at) {
                return true;
            }

            return this.getUnixTime() > this.expires_at.getTime();
        };

        /**
         * Get Unix time.
         *
         * @return bigint
         **/
        Session.prototype.getUnixTime = function () {
            return (new Date()).getTime();
        }

        /**
         * Flush all session data and return a new clean entity.
         *
         * @return self
         **/
        Session.prototype.flush = function () {
            this.storage.clear();

            return new Session();
        };

        /**
         * Save session in storage, for persistence.
         *
         * @return self
         **/
        Session.prototype.save = function() {
            this.set('session', JSON.stringify(this));

            return this;
        };

        /**
         * Set data for session.
         *
         * @param object $data
         *
         * @return self
         **/
        Session.prototype.setData = function($data) {
            this.token_type = $data.token_type;
            this.access_token = $data.access_token;
            this.expires_in = $data.expires_in;

            if (typeof $data.started_at !== 'undefined') {
                this.started_at = $data.started_at;
            }

            if (typeof this.expires_in === 'string') {
                this.expires_in = new Date(this.expires_in);
            }

            if (typeof this.started_at === 'string') {
                this.started_at = new Date(this.started_at);
            }

            var expires_in = this.expires_in * 1000;

            this.expires_at = new Date(this.started_at.getTime() + expires_in);

            return this;
        };

        /**
         * Get data from storage.
         *
         * @return object
         **/
        Session.prototype.getData = function () {
            var data = this.get('session');

            return JSON.parse(data);
        };

        /**
         * Check if current session is active.
         *
         * @return boolean
         **/
        Session.prototype.isActive = function() {
            var data = this.getData();

            if ( ! data) {
                return false;
            }

            if ( ! this.access_token) {
                this.setData(data);
            }

            return this.expired() === false;
        };

        return Session;
    };
})(angular);
