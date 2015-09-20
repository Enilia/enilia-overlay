
angular.module('enilia.overlay', ['ngRoute',
								  'enilia.overlay.tpls',
								  'enilia.overlay.controllers'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/dpsmeter.html',
			controller: 'dpsmeterController'
		})
		.when('/config', {
			templateUrl: 'templates/config.html',
			controller: 'configController'
		})
		.otherwise({
			templateUrl: 'templates/debug.html',
		});
	}])
;