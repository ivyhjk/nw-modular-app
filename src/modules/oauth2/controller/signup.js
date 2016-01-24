(function (angular) {
    'use strict';

    var module = 'App.OAuth2.Controller.SignUpController';

    angular
        .module(module, [])
        .controller(module, SignUpController);
    ;

    SignUpController.$inject = ['App.OAuth2.Resource.User'];

    function SignUpController (User) {
        var vm = this;

        vm.form = {
        	username : null,
        	email : null,
        	password: null,
        	password_confirm : null,
        	terms_agree : false
        };

        vm.submit = function () {
        	if ( ! vm.form.username) {
        		alert('A username is required');
        		return alert('Debe ingresar un nombre de usuario.');
        	}

        	if ( ! vm.form.email) {
        		return alert('Debe ingresar su E-Mail.');
        	}

        	if ( ! vm.form.password) {
        		return alert('Debe ingresar una clave.');
        	}

        	if ( ! vm.form.password_confirm) {
        		return alert('Debe ingresar la confirmación de clave.');
        	}

        	if (vm.form.password.length < 6) {
        		return alert('La clave debe tener a lo menos 6 carácteres.');
        	}

        	if (vm.form.password !== vm.form.password_confirm) {
        		return alert('Las claves no coinciden.');
        	}

        	var newUser = new User(vm.form);

        	var saved = User.save(newUser);

        	console.log(User);
        	console.log(newUser);
        	console.log(saved);
        };

    }
})(angular);
