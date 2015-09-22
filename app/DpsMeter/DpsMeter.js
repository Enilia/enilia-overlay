;(function() {

angular.module('enilia.overlay.dpsmeter', [])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/dpsmeter', {
				templateUrl: 'app/DpsMeter/dpsmeter.html',
				controller: 'dpsmeterController'
			})
	}])

	.factory('dpsmeterCache',
		['$cacheFactory',
		function dpsmeterCache($cacheFactory) {
			return $cacheFactory('dpsmeter-cache');
		}])

	.controller('dpsmeterController',
		['$scope', '$document', 'dpsmeterCache',
		function dpsmeterController($scope, $document, dpsmeterCache) {

			$scope.encounter = dpsmeterCache.get('encounter') || {
				encdps: "0",
				duration: "00:00",
			};
			$scope.combatants = dpsmeterCache.get('combatants');
			$scope.active = dpsmeterCache.get('active');


			$document.on('onOverlayDataUpdate', dataUpdate);

			$scope.$on('$destroy', function $destroy() {
				dpsmeterCache.put('encounter', $scope.encounter);
				dpsmeterCache.put('combatants', $scope.combatants);
				dpsmeterCache.put('active', $scope.active);
			});

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
				$scope.$broadcast('update');
				$scope.$apply();
			}

		}])

	.controller('EncounterController',
		['$scope',
		function EncounterController($scope) {

			angular.forEach($scope.encounter, function(value, key) {
				$scope[key] = value;
			});

			$scope.$on('update', function update() {
				angular.forEach($scope.encounter, function(value, key) {
					$scope[key] = value;
				});
				$scope.$apply();
			});

		}])

	.controller('CombatantsController',
		['$scope',
		function CombatantsController($scope) {

			// $scope.$on('update', function update() {

			// 	angular.forEach([1,2,3,4,5,6,7], function(value, index) {
			// 		$scope.combatants['YOU'+value] = angular.copy($scope.combatants.YOU);
			// 		$scope.combatants['YOU'+value].name = 'YOU'+value;
			// 	});
			// });
		}])

	.controller('CombatantController',
		['$scope',
		function CombatantController($scope) {

			angular.forEach($scope.combatant, function(value, key) {
				$scope[key] = value;
			});

			$scope.$on('update', function update() {

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

				angular.forEach(combatant, function(value, key) {
					$scope[key] = value;
				});
				$scope.$apply();
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

})();