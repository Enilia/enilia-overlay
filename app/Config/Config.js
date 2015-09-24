;(function() {

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex appelé sur null ou undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate doit être une fonction');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find a été appelé sur null ou undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate doit être une fonction');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

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
				__uid:3,
				preset: 1,
				presets: [
					{
						__uid:1,
						name:'DPS',
						cols: [
							{ name: 'name' },
							{ name: 'encdps' },
							{ name: 'damagePct' },
						]
					},
					{
						__uid:2,
						name:'Heal',
						cols : [
							{ name: 'name' },
							{ name: 'encdps' },
							{ name: 'damagePct' },
							{ name: 'enchps' },
							{ name: 'healedPct' },
							{ name: 'OverHealPct' },
						]
					}
				],
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

	.factory('presetManager',
		['$localStorage',
		function presetManagerFactory ($storage) {

			function uidTest (uid) {
				return function(preset) {
					return preset.__uid === uid;
				}
			}

			function findPos(preset) {
				return $storage.presets.findIndex(uidTest(preset.__uid));
			}

			return {
				get: function getPreset(uid) {
					uid = uid || $storage.preset;
					return $storage.presets.find(uidTest(uid));
				},

				set: function setPreset(preset) {
					$storage.preset = preset.__uid;
					return preset;
				},

				getAll: function getAllPreset() {
					return $storage.presets;
				},

				update: function updatePreset (preset) {
					var index = findPos(preset);
					return ~index && $storage.presets.splice(index, 1, preset) && preset;
				},

				remove: function removePreset (preset) {
					var index = findPos(preset);
					return ~index && $storage.presets.splice(index, 1)[0];
				},

				add: function addPreset (preset) {
					preset.__uid = $storage.__uid++;
					return $storage.presets.push(preset) && preset;
				}
			}
		}])

	.controller('configController',
		['$scope', 'presetManager',
		function configController($scope, presetManager) {

			$scope.globalExpandFromBottom = $scope.getExpandFromBottom();
			$scope.setExpandFromBottom(false, false);

			$scope.presets = presetManager.getAll();
			$scope.preset = presetManager.get();
			$scope.onPresetChange = function onPresetChange(preset) {
				presetManager.set(preset);
			}

			$scope.save = function() {
			};

			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom($scope.globalExpandFromBottom, false);
			});

		}])

	.controller('configPresetController',
		['$scope', '$routeParams', 'presetManager',
		function configPresetController($scope, $routeParams, presetManager) {

			$scope.preset = angular.copy(presetManager.get(parseInt($routeParams.presetId)));

			$scope.save = function() {
				presetManager.update($scope.preset);
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
				onChange:'=?',
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
						$scope.onChange(option.value);
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