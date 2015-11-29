(function(angular) {
    'use strict';

    angular.module('App.core').controller('MenuController', MenuController);

    MenuController.$inject = ['Menu'];

    function MenuController (Menu) {
        var vm = this;

        vm.items = Menu.getItems();
    }

})(angular);
