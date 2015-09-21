
angular.module('enilia.overlay.config', [])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/config', {
				templateUrl: 'app/Config/config.html',
				controller: 'configController'
			})
	}])

	.controller('configController', ['$scope', function($scope) {

	}])