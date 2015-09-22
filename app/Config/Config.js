
angular.module('enilia.overlay.config', ['ngStorage'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/config', {
				templateUrl: 'app/Config/config.html',
				controller: 'configController'
			})
	}])

	.controller('configController',
		['$scope', '$localStorage',
		function($scope, $localStorage) {

	}])