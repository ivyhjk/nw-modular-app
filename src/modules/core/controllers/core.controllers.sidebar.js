(function(angular) {
    'use strict';

    angular.module('App.core').controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope'];

    function SidebarController ($rootScope) {
        var vm = this;

        vm.collapsedMenu = $rootScope.collapsedMenu = false;
    }

})(angular);
