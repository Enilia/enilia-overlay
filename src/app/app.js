
angular.module('enilia.overlay', ['ngRoute',
								  'enilia.overlay.tpls',
								  'enilia.overlay.dpsmeter',
								  'enilia.overlay.config',
								  'enilia.overlay.dbmanager'])

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

	.factory('sanitize',
		function sanitizeFactory() {
			return function sanitize(unsafe) {
			  	if(angular.isObject(unsafe)) {
			  		angular.forEach(unsafe, function(value, key) {
			  			unsafe[key.replace(/%/g, 'Pct')] = sanitize(value);
			  		});
				}
				return unsafe;
			}
		})

	.run(['$rootScope',
		  '$document',
		  'userManager',
		  'sanitize',
		  function($scope, $document, userManager, sanitize) {

				$scope.state = { isLocked: true };
				$scope.expandFromBottom = userManager.get('expandFromBottom');

				$document.on('onOverlayStateUpdate', stateUpdate);
				$document.on('onOverlayDataUpdate', dataUpdate);

			    function stateUpdate(e) {

			        $scope.state = e.detail;
			        $scope.$apply();
			    }

			    function dataUpdate (e) {
			    	var session = userManager.getSession();
					session.encounter = sanitize(e.detail.Encounter);
					session.combatants = sanitize(e.detail.Combatant);
					session.active = e.detail.isActive;
			    }

			    $scope.setExpandFromBottom = function(value, save) {
			    	$scope.expandFromBottom = value;
			    	if(save !== false) {
			    		userManager.set('expandFromBottom', value);
			    	}
			    }

			    $scope.getExpandFromBottom = function() {
			    	return userManager.get('expandFromBottom');
			    }
		}])

	.controller('debugController',
		['$scope', '$location',
		function($scope, $location) {

			$scope.loc = $location;

		}])

;
