(function (angular) {
    var module = 'App.OAuth2.Resource.User';

	angular
        .module(module, [])
        .factory(module, User);

    User.$inject = ['$resource'];

    function User($resource) {
    	return $resource('/users');
    }
})(angular);
