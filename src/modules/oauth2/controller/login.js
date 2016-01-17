(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.LoginController';

    angular
        .module(module, [
            'App.OAuth2.Service.OAuth2'
        ])
        .controller(module, LoginController)
    ;

    LoginController.$inject = ['$state', 'App.OAuth2.Service.OAuth2'];

    function LoginController($state, OAuth2) {
        if (OAuth2.loggedIn() === true) {
            alert('You are already legged in!');

            return $state.go('app.home');
        }

        var vm = this;

        vm.auth = {
        	username : null,
        	password : null,
	        remember : false
        };

        vm.do = function () {
            if ( ! vm.auth.username) {
        		alert('A username is required');
        		focus('#LoginUsername');
        		return false;
        	}

        	if ( ! vm.auth.password) {
        		alert('A password is required');
        		focus('#LoginPassword');
        		return false;
        	}

            OAuth2.login(vm.auth, function (error) {
                vm.auth.password = null;
                focus('#LoginPassword');

                if (error) {
                    alert(error);
                }
            });
        };

        /**
         * Focus an input.
         *
         * @param string $selector
         *
         * @return void
         **/
        function focus($selector) {
        	var element = document.querySelector($selector);
        	angular.element(element)[0].focus();
        }
    }
})(angular);
