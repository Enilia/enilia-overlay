;(function() {

angular.module('enilia.overlay.config', ['ngRoute',
										 'ngStorage',
										 'enilia.overlay.tpls',
										 'enilia.overlay.dpsmeter'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/config', {
				templateUrl: 'app/Config/config.html',
				controller: 'configController'
			})
	}])

	.controller('configController',
		['$scope', '$localStorage',
		function configController($scope, $storage) {

			$scope.setExpandFromBottom(false);
			$scope.expandFromBottom = $storage.expandFromBottom;

			$scope.save = function() {
				$storage.expandFromBottom = $scope.expandFromBottom;
			};

			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom($storage.expandFromBottom);
			});

		}])

	.directive('fieldselect', function() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/fieldselect.html',
			scope: {
				selected: '='
			},
		}
	})

	

})();