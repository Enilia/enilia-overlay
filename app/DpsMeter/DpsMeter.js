;(function() {

angular.module('enilia.overlay.dpsmeter', ['ngRoute',
										   'ngStorage',
										   'enilia.overlay.tpls'])

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
				$scope.$broadcast('update');
				$scope.$apply();
			}

		}])

	.controller('EncounterController',
		['$scope',
		function EncounterController($scope) {

			update();

			$scope.$on('update', update);

			function update() {
				angular.forEach($scope.encounter, function(value, key) {
					$scope[key] = value;
				});
			}

		}])

	.controller('CombatantsController',
		['$scope',
		function CombatantsController($scope) {

			update();

			$scope.$on('update', update);

			function update() {

				$scope.bestdps = 0;

				angular.forEach($scope.combatants, function(combatant) {
					if(parseFloat(combatant.encdps) > $scope.bestdps){
						$scope.bestdps = parseFloat(combatant.encdps);
					}
				});

				// angular.forEach([1,2,3,4,5,6,7], function(value, index) {
				// 	$scope.combatants['YOU'+value] = angular.copy($scope.combatants.YOU);
				// 	$scope.combatants['YOU'+value].name = 'YOU'+value;
				// });
			}

		}])

	.controller('CombatantController',
		['$scope',
		function CombatantController($scope) {

			update();

			$scope.$on('update', update);
			// $scope.$on('update', $scope.$apply.bind($scope));

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

				angular.forEach(combatant, function(value, key) {
					$scope[key] = value;
				});
			}

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
			link:function(scope, element) {
				update();
				scope.$on('update', update);
				function update() {
					var stop = scope.encdps * 100 / scope.bestdps;
					element.css('background-size', stop + "% 100%, " + stop + "% 100%");
				}
			}
		}
	});

})();