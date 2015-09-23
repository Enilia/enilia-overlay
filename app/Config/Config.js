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

	.factory('removeSelection',
		['$window',
		function removeSelectionFactory($window) {
			return function removeSelection () {
				$window.requestAnimationFrame(function() {
					$window.getSelection().removeAllRanges();
				});
			};
		}])

	.controller('configController',
		['$scope', '$localStorage',
		function configController($scope, $storage) {

			$storage.$default({
			    expandFromBottom: false,
			    cols: [
					{ name: 'name' },
					{ name: 'encdps' },
					{ name: 'damagePct' },
					{ name: 'enchps' },
					{ name: 'healedPct' },
					{ name: 'OverHealPct' },
			    ]
			});

			$scope.localExpandFromBottom = $scope.getExpandFromBottom();
			$scope.confExpandFromBottom = $storage.expandFromBottom;
			$scope.setExpandFromBottom(false);

			$scope.cols = $storage.cols.slice();

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
			controller:['$scope', 'removeSelection',
				function fieldselectController($scope, removeSelection) {
					$scope.fields = [
						"name","duration","DURATION","damage","damage-m","DAMAGE-k",
						"DAMAGE-m","damage%","dps","DPS","DPS-k","encdps",
						"ENCDPS","ENCDPS-k","hits","crithits","crithit%","misses",
						"hitfailed","swings","tohit","TOHIT","maxhit","MAXHIT",
						"healed","healed%","enchps","ENCHPS","ENCHPS-k","critheals",
						"critheal%","heals","cures","maxheal","MAXHEAL","maxhealward",
						"MAXHEALWARD","damagetaken","healstaken","powerdrain","powerheal","kills",
						"deaths","threatstr","threatdelta","NAME3","NAME4","NAME5",
						"NAME6","NAME7","NAME8","NAME9","NAME10","NAME11",
						"NAME12","NAME13","NAME14","NAME15","Last10DPS","Last30DPS",
						"Last60DPS","Job","ParryPct","BlockPct","IncToHit","OverHealPct"];

					$scope.removeSelection = removeSelection;

					$scope.setSelected = function(field) {
						$scope.selected = field;
					};
				}],
		}
	})

	.directive('checkbox', function() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/checkbox.html',
			scope: {
				checked: '='
			},
			controller:['$scope', 'removeSelection',
				function checkboxController ($scope, removeSelection) {
				
					$scope.click = function click () {
						$scope.checked = !$scope.checked;
					};

					$scope.removeSelection = removeSelection;

				}],
		}
	})

	.directive('sorter', function() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/sorter.html',
			scope: {
				ngModel:'=',
				$index:'=index',
				sortableDirection:'@?',
			},
			controller:['$scope', 'removeSelection',
				function sorterController ($scope, removeSelection) {

					function setScope() {
						$scope.$first = ($scope.$index === 0);
						$scope.$last = ($scope.$index === ($scope.ngModel.length - 1));
					}

					$scope.$watch('$index', setScope);
				
					$scope.up = function up() {
						if($scope.$first) return;
						var move = $scope.ngModel.splice($scope.$index, 1);
						$scope.ngModel.splice($scope.$index-1, 0, move[0]);
					};
					$scope.down = function down() {
						if($scope.$last) return;
						var move = $scope.ngModel.splice($scope.$index, 1);
						$scope.ngModel.splice($scope.$index+1, 0, move[0]);
					};

					$scope.removeSelection = removeSelection;

				}],
		}
	})

	

})();