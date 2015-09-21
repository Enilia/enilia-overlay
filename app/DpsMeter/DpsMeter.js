
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
			};

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
		function($scope) {

			angular.forEach($scope.encounter, function(value, key) {
				$scope[key] = value;
			});

			$scope.$on('update', function() {
				angular.forEach($scope.encounter, function(value, key) {
					$scope[key] = value;
				});
				$scope.$apply();
			});

		}])

	.controller('CombatantsController',
		['$scope',
		function($scope) {

			// $scope.$on('update', function() {

			// 	angular.forEach([1,2,3,4,5,6,7], function(value, index) {
			// 		$scope.combatants['YOU'+value] = angular.copy($scope.combatants.YOU);
			// 		$scope.combatants['YOU'+value].name = 'YOU'+value;
			// 	});
			// });
		}])

	.controller('CombatantController',
		['$scope',
		function($scope) {

			$scope.$on('update', function() {

				var index
				  , combatant = $scope.combatant
				  ;

				if(!combatant.Job) {
					if(~(index = combatant.name.indexOf("-Egi ("))) {
						combatant.Job = combatant.name.substring(0,egiSearch);
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
					} else {
						combatant.Job = "error";
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