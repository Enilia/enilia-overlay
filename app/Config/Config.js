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

			$storage.$default({
			    expandFromBottom: false
			});

			$scope.localExpandFromBottom = $scope.getExpandFromBottom();
			$scope.confExpandFromBottom = $storage.expandFromBottom;
			$scope.setExpandFromBottom(false);

			$scope.save = function() {
				$storage.expandFromBottom = $scope.confExpandFromBottom;
				$scope.localExpandFromBottom = $scope.confExpandFromBottom;
			};

			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom($scope.localExpandFromBottom);
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

	.directive('checkbox', function() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/checkbox.html',
			controller:['$scope', '$window', function checkboxController ($scope, $window) {
				
				$scope.click = function click () {
					$scope.checked = !$scope.checked;
				};

				$scope.removeSelection = function removeSelection () {
					$window.requestAnimationFrame(function() {
						$window.getSelection().removeAllRanges();
					});
				};

			}],
			scope: {
				checked: '='
			},
		}
	})

	

})();