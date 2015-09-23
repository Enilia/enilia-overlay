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

	.run(['$localStorage',
		function($storage) {
			// TODO: use $default for release
			$storage.$reset({
				cols: [
					{ name: 'name' },
					{ name: 'encdps' },
					{ name: 'damagePct' },
					{ name: 'enchps' },
					{ name: 'healedPct' },
					{ name: 'OverHealPct' },
				]
			});
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

			$scope.globalExpandFromBottom = $scope.getExpandFromBottom();
			// $scope.confExpandFromBottom = $storage.expandFromBottom;
			$scope.setExpandFromBottom(false, false);

			$scope.cols = $storage.cols.slice();

			$scope.save = function() {
				// $storage.expandFromBottom = $scope.confExpandFromBottom;
				// $scope.globalExpandFromBottom = $scope.confExpandFromBottom;
				$storage.cols = $scope.cols;
			};

			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom($scope.globalExpandFromBottom, false);
			});

		}])

	.directive('preventSelection', ['$window',
		function preventSelectionDirective($window) {
			return {
				restrict:'A',
				link:function(scope, element) {
					element.on('mousedown', function() {
						$window.requestAnimationFrame(function() {
							$window.getSelection().removeAllRanges();
						});
					})
				}
			}
		}])

	.directive('columnConfig', function columnConfigDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/columnConfig.html',
			scope: {
				cols: '='
			},
			controller:['$scope', '$document', 
				function($scope, $document) {

					$scope.remove = function($event, index) {
						if($scope.removeIndex === index) {
							$scope.cols.splice(index, 1);
						} else {
							$scope.removeIndex = index;
							$document.one('click', function() {
								$scope.removeIndex = -1;
								$scope.$apply();
							});
							$event.stopPropagation();
						}
					};

					$scope.add = function() {
						$scope.cols.push({ name: 'name' })
					}
				}],
		}
	})

	.directive('fieldselect', function fieldselectDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/fieldselect.html',
			scope: {
				selected: '='
			},
			controller:['$scope',
				function fieldselectController($scope) {
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

					$scope.setSelected = function(field) {
						$scope.selected = field;
					};
				}],
		}
	})

	.directive('checkbox', function checkboxDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/checkbox.html',
			scope: {
				checked: '='
			},
			controller:['$scope',
				function checkboxController ($scope) {
				
					$scope.click = function click () {
						$scope.checked = !$scope.checked;
					};

				}],
		}
	})

	.directive('sorter', function sorterDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/sorter.html',
			scope: {
				ngModel:'=',
				$index:'=index',
				sortableDirection:'@?',
			},
			controller:['$scope',
				function sorterController ($scope) {

					function setScope() {
						$scope.$first = ($scope.$index === 0);
						$scope.$last = ($scope.$index === ($scope.ngModel.length - 1));
					}

					$scope.$watch('$index', setScope);
					$scope.$watch('ngModel.length', setScope);
				
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

				}],
		}
	})

	

})();