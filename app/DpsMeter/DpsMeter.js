
angular.module('enilia.overlay.dpsmeter', [])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/dpsmeter', {
				templateUrl: 'app/DpsMeter/dpsmeter.html',
				controller: 'dpsmeterController'
			})
	}])

	.controller('dpsmeterController',
		['$scope', '$document',
		function($scope, $document) {

			$document.on('onOverlayDataUpdate', dataUpdate);

			$scope.encounter = {
				encdps: "0",
				duration: "00:00",
			}

			function sanitize(unsafe) {
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

			function dataUpdate(e) {
				$scope.encounter = sanitize(e.detail.Encounter);
				$scope.combatants = sanitize(e.detail.Combatant);
				$scope.active = e.detail.isActive;
				$scope.$apply();
			}

		}])

	.controller('EncounterController',
		['$scope',
		function($scope) {

			$scope.$watchCollection('encounter', function(encounter) {
				angular.forEach(encounter, function(value, key) {
					$scope[key] = value;
				});
			});

		}])

	.controller('CombatantsController',
		['$scope',
		function($scope) {

		}])

	.controller('CombatantController',
		['$scope',
		function($scope) {

			$scope.$watchCollection('combatant', function(combatant) {
				angular.forEach(combatant, function(value, key) {
					$scope[key] = value;
				});
			});

		}])

	.directive('encounter', function encounterDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/encounter.html',
			controller:'EncounterController',
			scope:true,
		}
	})

	.directive('combatants', function combatantsDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/combatants.html',
			controller:'CombatantsController',
			scope:true,
		}
	})

	.directive('combatant', function combatantDirective() {
		return {
			restrict: 'A',
			templateUrl:'app/DpsMeter/partials/combatant.html',
			controller:'CombatantController',
			scope:true,
		}
	});