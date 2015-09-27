
angular.module('enilia.overlay', ['ngRoute',
								  'ngStorage',
								  'enilia.overlay.tpls',
								  'enilia.overlay.dpsmeter',
								  'enilia.overlay.config'])

	.constant('VERSION', '{#VERSION#}')

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/dpsmeter',
			})
			.otherwise({
				templateUrl: 'app/Debug/debug.html',
				controller: 'debugController'
			});
	}])

	.run(['$localStorage', 'VERSION',
		function update($storage, VERSION) {
			if($storage.VERSION) {
				var version = $storage.VERSION.match(/(\d+).(\d+).(\d+)(?:-(.+))/)
				  , major = version[1]
				  , minor = version[2]
				  , patch = version[3]
				  , build = version[4]
				  ;

				/* Placeholder for future db patchs */
			} else {
				$storage.$reset({
					__uid:3,
					preset: 1,
					presets: [
						{
							__uid:1,
							name:'DPS',
							cols: [
								{label:  'Name',value: 'name'},
								{label:  'Dps',value: 'encdps'},
								{label:  'Dps%',value: 'damagePct'},
								{label:  'Crit%',value: 'crithitPct'},
								{label:  'Misses',value: 'misses'},
							]
						},
						{
							__uid:2,
							name:'Heal',
							cols : [
								{label:  'Name',value: 'name'},
								{label:  'Dps',value: 'encdps'},
								{label:  'Dps%',value: 'damagePct'},
								{label:  'Hps',value: 'enchps'},
								{label:  'Hps%',value: 'healedPct'},
								{label:  'OverHeal',value: 'OverHealPct'},
							]
						}
					],
					VERSION: VERSION,
				});
			}
		}])

	.run(['$rootScope',
		  '$document',
		  '$localStorage',
		  function($scope, $document, $storage) {

				$storage.$default({
				    expandFromBottom: false
				});

				$scope.state = { isLocked: true };
				$scope.expandFromBottom = $storage.expandFromBottom;

				$document.on('onOverlayStateUpdate', stateUpdate);

			    function stateUpdate(e) {

			        $scope.state = e.detail;
			        $scope.$apply();
			    }

			    $scope.setExpandFromBottom = function(set, save) {
			    	$scope.expandFromBottom = set;
			    	if(save !== false) {
			    		$storage.expandFromBottom = set;
			    	}
			    }

			    $scope.getExpandFromBottom = function() {
			    	return $storage.expandFromBottom;
			    }
		}])

	.controller('debugController',
		['$scope', '$location',
		function($scope, $location) {

			$scope.loc = $location;

		}])

;