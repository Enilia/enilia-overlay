;(function() {

angular.module('enilia.overlay.navigation', ['enilia.overlay.tpls'])

	.directive('menu', [
		function menuDirective() {
			
			return {
				restrict: 'E',
				templateUrl:'app/Navigation/partials/navigation.html',
				scope: true,
				controller:[ '$scope', '$location',
					function menuController($scope, $location) {
						$scope.location = $location.path();
						$scope.$on('$routeChangeSuccess', function() {
							$scope.location = $location.path();
						})

						$scope.$on('$routeChangeError', function() {
						})
					}],
			}

		}])


})();