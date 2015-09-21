
angular.module('enilia.overlay', ['ngRoute',
								  'enilia.overlay.tpls',
								  'enilia.overlay.dpsmeter',
								  'enilia.overlay.config'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/dpsmeter',
			})
			.otherwise({
				templateUrl: 'app/Debug/debug.html',
				controller: 'debugController'
			});
	}])

	.controller('stateWatcherController',
		['$scope', '$document',
		function($scope, $document) {

			$scope.state = { isLocked: true };

			$document.on('onOverlayStateUpdate', stateUpdate);

		    function stateUpdate(e) {

		        $scope.state = e.detail;
		        $scope.$apply();
		    }

		}])

	.controller('debugController',
		['$scope', '$location',
		function($scope, $location) {

			$scope.loc = $location;

		}])

;