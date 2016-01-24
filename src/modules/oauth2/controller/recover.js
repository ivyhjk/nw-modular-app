(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.RecorverController';

    angular
        .module(module, [])
        .controller(module, RecorverController);
    ;

    RecorverController.$inject = [];

    function RecorverController() {
        var vm = this;

        vm.form = {
        	email : null
        };

        vm.submit = function () {
        	if ( ! vm.form.email) {
        		return alert('Debe ingresar su E-Mail!.');
        	}

        	console.log(vm.form);
        };
    }
})(angular);
