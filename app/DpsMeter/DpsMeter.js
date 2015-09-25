;(function() {

angular.module('enilia.overlay.dpsmeter', ['ngRoute',
										   'ngStorage',
										   'enilia.overlay.tpls',
										   'enilia.overlay.config'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/dpsmeter', {
				templateUrl: 'app/DpsMeter/dpsmeter.html',
				controller: 'dpsmeterController'
			})
	}])

	.run(['$sessionStorage',
		function($storage) {
			$storage.$default({
				encounter:{
					encdps: "0",
					duration: "00:00",
				},
				active: false
			});
		}])

	.factory('sanitize',
		function sanitizeFactory() {
			return function sanitize(unsafe) {
				var ret = {};

			  	if(angular.isObject(unsafe)) {
			  		angular.forEach(unsafe, function(value, key) {
			  			ret[key.replace(/%/g, 'Pct')] = sanitize(value);
			  		});
					return ret;
				} else {
					return unsafe;
				}
			}
		})

	.controller('dpsmeterController',
		['$scope', '$document', '$sessionStorage', 'sanitize', '$timeout',
		function dpsmeterController($scope, $document, $sessionStorage, sanitize, $timeout) {

			$scope.setExpandFromBottom($scope.getExpandFromBottom(), false);
			$scope.$on('$destroy', function() {
				$scope.setExpandFromBottom(false, false);
			});

			$scope.encounter = $sessionStorage.encounter;
			$scope.combatants = $sessionStorage.combatants;
			$scope.active = $sessionStorage.active;

			// todo: move this to app.js and retrive data on $on/$emit
			$document.on('onOverlayDataUpdate', dataUpdate);

			$scope.$on('$destroy', function $destroy() {
				$sessionStorage.encounter = $scope.encounter;
				$sessionStorage.combatants = $scope.combatants;
				$sessionStorage.active = $scope.active;
			});

			function dataUpdate(e) {
				$scope.encounter = sanitize(e.detail.Encounter);
				$scope.combatants = sanitize(e.detail.Combatant);
				$scope.active = e.detail.isActive;
				$scope.$apply();
			}

		}])

	.controller('EncounterController',
		['$scope',
		function EncounterController($scope) {

		}])

	.controller('CombatantsController',
		['$scope', 'presetManager',
		function CombatantsController($scope, presetManager) {

			$scope.bestdps = 0;

			$scope.headers = presetManager.get().cols;

			$scope.$watch('combatants', update);

			function update() {

				$scope.bestdps = 0;

				angular.forEach($scope.combatants, function(combatant) {
					if(parseFloat(combatant.encdps) > $scope.bestdps){
						$scope.bestdps = parseFloat(combatant.encdps);
					}
				});
			}

		}])

	.controller('CombatantController',
		['$scope', 'presetManager',
		function CombatantController($scope, presetManager) {

			$scope.cols = presetManager.get().cols;

			$scope.$watch('combatant', update);

			function update() {

				var index
				  , combatant = $scope.combatant
				  ;

				if(!combatant.Job) {
					if(~(index = combatant.name.indexOf("-Egi ("))) {
						combatant.Job = combatant.name.substring(0,index);
						combatant.isEgi = true;
					} else if(combatant.name.indexOf("Eos (")==0) {
						combatant.Job = "Eos";
						combatant.isFairy = true;
					} else if(combatant.name.indexOf("Selene (")==0) {
						combatant.Job = "Selene";
						combatant.isFairy = true;
					} else if(combatant.name.indexOf("Carbuncle (")==0) {
						combatant.Job = "Carbuncle";
						combatant.isCarbuncle = true;
					} else if(~combatant.name.indexOf(" (")) {
						combatant.Job = "Choco";
						combatant.isChoco = true;
					} else if(combatant.name === "Limit Break") {
						combatant.Job = "Limit-Break";
						combatant.isLB = true;
					} else {
						combatant.Job = "Error";
					}
				}
			}

		}])

	.directive('encounter', function encounterDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/encounter.html',
			controller:'EncounterController',
			scope:{
				encounter:'=',
				active:'='
			},
		}
	})

	.directive('combatants', function combatantsDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/combatants.html',
			controller:'CombatantsController',
			scope:{
				combatants:'='
			},
		}
	})

	.directive('combatant', function combatantDirective() {
		return {
			restrict: 'A',
			templateUrl:'app/DpsMeter/partials/combatant.html',
			controller:'CombatantController',
			scope:{
				combatant:'=',
				bestdps:'='
			},
			link:function(scope, element) {
				scope.$watchGroup(['bestdps', 'combatant.encdps'], update);
				function update() {
					var stop = scope.combatant.encdps * 100 / scope.bestdps;
					element.css('background-size', stop + "% 100%");
				}
			}
		}
	});

})();