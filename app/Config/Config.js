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
			.when('/config/preset/:presetId', {
				templateUrl:'app/Config/partials/presetConfig.html',
				controller: 'configPresetController'
			})
	}])

	.run(['$localStorage',
		function($storage) {
			// TODO: use $default for release
			$storage.$reset({
				preset: {
					cols: [
						{ name: 'name' },
						{ name: 'encdps' },
						{ name: 'damagePct' },
					]
				},
				presets: {
					'DPS':{
						cols: [
							{ name: 'name' },
							{ name: 'encdps' },
							{ name: 'damagePct' },
						]
					},
					'Heal':{
						cols : [
							{ name: 'name' },
							{ name: 'encdps' },
							{ name: 'damagePct' },
							{ name: 'enchps' },
							{ name: 'healedPct' },
							{ name: 'OverHealPct' },
						]
					}
				},
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
			$scope.setExpandFromBottom(false, false);

			$scope.cols = $storage.cols.slice();
			$scope.presets = $storage.presets;
			$scope.preset = $storage.preset;

			$scope.save = function() {
				$storage.cols = $scope.cols;
			};

			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom($scope.globalExpandFromBottom, false);
			});

		}])

	.controller('configPresetController',
		['$scope', '$routeParams', '$localStorage',
		function configPresetController($scope, $routeParams, $storage) {

			$scope.preset = angular.copy($storage.presets[$routeParams.presetId]);
			$scope.name = $routeParams.presetId;

			$scope.save = function() {
				if(angular.equals($storage.preset, $storage.presets[$routeParams.presetId])) {
					$storage.preset = $scope.preset;
				}
				delete $storage.presets[$routeParams.presetId];
				$storage.presets[$scope.name] = $scope.preset;
			};

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

					$scope.colsCollection = [
						"name","duration","DURATION","damage","damage-m","DAMAGE-k",
						"DAMAGE-m","damagePct","dps","DPS","DPS-k","encdps",
						"ENCDPS","ENCDPS-k","hits","crithits","crithitPct","misses",
						"hitfailed","swings","tohit","TOHIT","maxhit","MAXHIT",
						"healed","healedPct","enchps","ENCHPS","ENCHPS-k","critheals",
						"crithealPct","heals","cures","maxheal","MAXHEAL","maxhealward",
						"MAXHEALWARD","damagetaken","healstaken","powerdrain","powerheal","kills",
						"deaths","threatstr","threatdelta","NAME3","NAME4","NAME5",
						"NAME6","NAME7","NAME8","NAME9","NAME10","NAME11",
						"NAME12","NAME13","NAME14","NAME15","Last10DPS","Last30DPS",
						"Last60DPS","Job","ParryPct","BlockPct","IncToHit","OverHealPct"];

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
				ngModel: '=',
				options: '=',
				label: '@?',
			},
			controller:['$scope', '$parse',
				function fieldselectController($scope, $parse) {

					var parsedOptions = $scope.parsedOptions = []
					  , getLabel = $scope.label ? ($scope.label === "{key}" ? getKey : $parse($scope.label)) : angular.identity
					  ;

	  				function getKey(option, key) {
	  					return key;
	  				}

					angular.forEach($scope.options, function(option, key) {
						var obj = {
								label:getLabel(option) || getLabel(null, key),
								value:option
							};
						if(angular.equals(option, $scope.ngModel)) $scope.selectedLabel = obj.label;
						parsedOptions.push(obj);
					});

					$scope.setSelected = function(option) {
						$scope.ngModel = option.value;
						$scope.selectedLabel = option.label;
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