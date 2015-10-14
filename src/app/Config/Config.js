;(function() {

angular.module('enilia.overlay.config', ['ngRoute',
										 'enilia.overlay.tpls',
										 'enilia.overlay.dpsmeter',
										 'enilia.overlay.dbmanager'])

	.config(['$routeProvider', 'userManagerProvider', function($routeProvider, userManagerProvider) {
		$routeProvider
			.when('/config', {
				templateUrl: 'app/Config/config.html',
				controller: 'configController',
				resolve: {
					user: userManagerProvider.load,
				},
			})
			.when('/config/preset/new', {
				templateUrl:'app/Config/partials/preset.html',
				controller: 'newPresetController',
					resolve: {
						user: userManagerProvider.logIn,
					},
			})
			.when('/config/preset/:presetId/edit', {
				templateUrl:'app/Config/partials/preset.html',
				controller: 'editPresetController',
					resolve: {
						user: userManagerProvider.logIn,
					},
			})
			.when('/config/preset/:cloneId/clone', {
				templateUrl:'app/Config/partials/preset.html',
				controller: 'clonePresetController',
					resolve: {
						user: userManagerProvider.logIn,
					},
			})
			.when('/config/preset/:presetId/delete', {
				templateUrl:'app/Config/partials/delete.html',
				controller: 'deletePresetController',
					resolve: {
						user: userManagerProvider.logIn,
					},
			})
			.when('/config/preset/:presetId/copy', {
				templateUrl:'app/Config/partials/preset.html',
				controller: 'copyPresetController',
					resolve: {
						preset: ['ParseClasses', '$q', '$route', 'userManager',
						function(ParseClasses, $q, $route, userManager) {
							return $q.resolve(new Parse.Query(ParseClasses['Preset'])
								.get($route.current.params.presetId))
								.then(function(preset) {
									var acl = new Parse.ACL(userManager.getUser())
									  , clone = preset.clone()
									  ;

									acl.setPublicReadAccess(true);
									clone.setACL(acl);
									return clone;
								})
						}],
					},
			})
	}])

	.controller('configController',
		['$scope', 'presetManager', '$document',
		function configController($scope, presetManager, $document) {

			$scope.presets = presetManager.getAll();
			$scope.selectedPreset = presetManager.get();
			$scope.select = function select(preset) {
				$scope.selectedPreset = preset;
			}

			$scope.remove = function($event, preset) {
				if($scope.checkRemove === preset) {
					// follow link
				} else {
					$event.preventDefault();
					$scope.checkRemove = preset;
					$event.stopPropagation();
				}
			};

			function documentClick() {
				$scope.$apply(function() {
					delete $scope.checkRemove;
				});
			}

			$document.on('click', documentClick);

			$scope.$on('$routeChangeStart', function() {
				$document.off('click', documentClick);
				presetManager.set($scope.selectedPreset);
			})

		}])

	.controller('editPresetController',
		['$scope', '$routeParams', 'presetManager', '$location',
		function editPresetController($scope, $routeParams, presetManager, $location) {

			var preset = presetManager.getClone($routeParams.presetId);

			if(!preset) {
				$location.path('/config/preset/'+$routeParams.presetId+'/copy');
			}

			$scope.title = "Editing";

			$scope.preset = presetManager.getClone($routeParams.presetId);

			$scope.save = function($event) {
				presetManager.update(presetManager.get($routeParams.presetId), $scope.preset);
			};

		}])

	.controller('newPresetController',
		['$scope', 'presetManager', '$location',
		function newPresetController($scope, presetManager, $location) {

			$scope.title = "Creating";

			$scope.preset = presetManager.$getDefault();

			$scope.save = function($event) {
				$event.preventDefault();
				$scope.setLoading(true);
				presetManager.add($scope.preset)
					.finally(function() {
						$location.path($event.target.hash.replace('#',''));
						$scope.setLoading(false);
					})
			};

		}])

	.controller('clonePresetController',
		['$scope', '$routeParams', 'presetManager', '$location',
		function clonePresetController($scope, $routeParams, presetManager, $location) {

			var preset = presetManager.getClone($routeParams.cloneId);

			if(!preset) {
				$location.path('/config/preset/'+$routeParams.cloneId+'/copy');
			}

			$scope.title = "Cloning";

			$scope.preset = presetManager.getClone($routeParams.cloneId);

			$scope.save = function($event) {
				$event.preventDefault();
				$scope.setLoading(true);
				presetManager.add($scope.preset)
					.finally(function() {
						$location.path($event.target.hash.replace('#',''));
						$scope.setLoading(false);
					})
			};

		}])

	.controller('deletePresetController',
		['$scope', '$routeParams', 'presetManager', '$location',
		function deletePresetController($scope, $routeParams, presetManager, $location) {

			$scope.title = "Deleting";

			$scope.preset = presetManager.get($routeParams.presetId);

			$scope.delete = function($event) {
				$event.preventDefault();
				$scope.setLoading(true);
				presetManager.remove($scope.preset)
					.finally(function() {
						$location.path($event.target.hash.replace('#',''));
						$scope.setLoading(false);
					})
			};

		}])

	.controller('copyPresetController',
		['$scope', '$routeParams', 'presetManager', '$location', 'preset',
		function copyPresetController($scope, $routeParams, presetManager, $location, preset) {

			$scope.title = "Copying";

			$scope.preset = preset;

			$scope.save = function($event) {
				$event.preventDefault();
				$scope.setLoading(true);
				presetManager.add($scope.preset)
					.finally(function() {
						$location.path($event.target.hash.replace('#',''));
						$scope.setLoading(false);
					})
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

	.directive('autoSelect', ['$window',
		function autoSelectDirective($window) {
			return {
				restrict:'A',
				link:function(scope, element) {
					element.on('click', function() {
						if($window.getSelection().toString().length) return;
						element[0].select();
					})
				}
			}
		}])

	.directive('presetConfig', function presetConfigDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/formcontrols/presetConfig.html',
			scope: {
				cols: '='
			},
			controller:['$scope', '$document',
				function($scope, $document) {

					$scope.colsCollection = [
						{label:  'Name',value: 'name'},{label:  'Duration',value: 'duration'},{label:  'Duration (s)',value: 'DURATION'},
						{label:  'Damage',value: 'damage'},{label:  'Damage (m)',value: 'damage-m'},{label:  'Damage (k)',value: 'DAMAGE-k'},
						{label:  'Damage(M)',value: 'DAMAGE-m'},{label:  'Damage (%)',value: 'damagePct'},{label:  'dps',value: 'dps'},
						{label:  'DPS',value: 'DPS'},{label:  'DPS (k)',value: 'DPS-k'},{label:  'Encdps',value: 'encdps'},
						{label:  'ENCDPS',value: 'ENCDPS'},{label:  'ENCDPS (k)',value: 'ENCDPS-k'},{label:  'Hits',value: 'hits'},
						{label:  'Crit Hits',value: 'crithits'},{label:  'Crit Hits (%)',value: 'crithitPct'},{label:  'Misses',value: 'misses'},
						{label:  'Hit Failed',value: 'hitfailed'},{label:  'Swings',value: 'swings'},{label:  'Accuracy',value: 'tohit'},
						{label:  'ACCURACY',value: 'TOHIT'},{label:  'Best Attack',value: 'maxhit'},{label:  'Best Damage',value: 'MAXHIT'},
						{label:  'Healed',value: 'healed'},{label:  'Healed (%)',value: 'healedPct'},{label:  'Enchps',value: 'enchps'},
						{label:  'ENCHPS',value: 'ENCHPS'},{label:  'ENCHPS (k)',value: 'ENCHPS-k'},{label:  'Crit Heals',value: 'critheals'},
						{label:  'Crit Heals (%)',value: 'crithealPct'},{label:  'Heals',value: 'heals'},{label:  'Cures',value: 'cures'},
						{label:  'Best Heal',value: 'maxheal'},{label:  'Max Heal',value: 'MAXHEAL'},{label:  'Best Heal Ward',value: 'maxhealward'},
						{label:  'Max Heal Ward',value: 'MAXHEALWARD'},{label:  'Damage Taken',value: 'damagetaken'},{label:  'Heals Taken',value: 'healstaken'},
						{label:  'Powerdrain',value: 'powerdrain'},{label:  'Powerheal',value: 'powerheal'},{label:  'Kills',value: 'kills'},
						{label:  'Deaths',value: 'deaths'},{label:  'Threat Str',value: 'threatstr'},{label:  'Threat Delta',value: 'threatdelta'},
						{label:  'Name (3)',value: 'NAME3'},{label:  'Name (4)',value: 'NAME4'},{label:  'Name (5)',value: 'NAME5'},
						{label:  'Name (6)',value: 'NAME6'},{label:  'Name (7)',value: 'NAME7'},{label:  'Name (8)',value: 'NAME8'},
						{label:  'Name (9)',value: 'NAME9'},{label:  'Name (10)',value: 'NAME10'},{label:  'Name (11)',value: 'NAME11'},
						{label:  'Name (12)',value: 'NAME12'},{label:  'Name (13)',value: 'NAME13'},{label:  'Name (14)',value: 'NAME14'},
						{label:  'Name (15)',value: 'NAME15'},{label:  'Last 10s DPS',value: 'Last10DPS'},{label:  'Last 30s DPS',value: 'Last30DPS'},
						{label:  'Last 60s DPS',value: 'Last60DPS'},{label:  'Job',value: 'Job'},{label:  'Parry (%)',value: 'ParryPct'},
						{label:  'Block (%)',value: 'BlockPct'},{label:  'Inc To Hit',value: 'IncToHit'},{label:  'OverHeal (%)',value: 'OverHealPct'},
					];

					$scope.remove = function($event, index) {
						if($scope.removeIndex === index) {
							$scope.cols.splice(index, 1);
						} else {
							$scope.removeIndex = index;
							$document.one('click', function() {
								$scope.$apply(function() {
									$scope.removeIndex = -1;
								});
							});
							$event.stopPropagation();
						}
					};


					$scope.newcol = [{label:  'Name',value: 'name'}];

					$scope.add = function(newcol) {
						$scope.cols.push(angular.copy(newcol));
					}
				}],
		}
	})

	.directive('fieldselect', function fieldselectDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/formcontrols/fieldselect.html',
			scope: {
				ngModel: '=',
				options: '=',
				label: '@?',
				value: '@?',
				onChange:'=?',
			},
			controller:['$scope', '$parse',
				function fieldselectController($scope, $parse) {

					var parsedOptions = $scope.parsedOptions = []
					  , getLabel = $scope.label ? ($scope.label === "{key}" ? getKey : $parse($scope.label)) : angular.identity
					  , getValue = $scope.value ? $parse($scope.value) : angular.identity
					  ;

	  				function getKey(option, key) {
	  					return key;
	  				}

					angular.forEach($scope.options, function(option, key) {
						var obj = {
								label:getLabel(option) || getLabel(null, key),
								value:getValue(option)
							};
						if(angular.equals(obj.value, $scope.ngModel)) $scope.selectedLabel = obj.label;
						parsedOptions.push(obj);
					});

					$scope.setSelected = function(option) {
						$scope.ngModel = angular.copy(option.value);
						$scope.selectedLabel = option.label;
						($scope.onChange || angular.identity)(option.value);
					};
				}],
		}
	})

	.directive('checkbox', function checkboxDirective() {
		return {
			restrict:'E',
			templateUrl:'app/Config/partials/formcontrols/checkbox.html',
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
			templateUrl:'app/Config/partials/formcontrols/sorter.html',
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
