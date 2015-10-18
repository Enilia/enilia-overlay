
angular.module('enilia.overlay', ['ngRoute',
								  'ngAnimate',
								  'enilia.overlay.tpls',
								  'enilia.overlay.dpsmeter',
								  'enilia.overlay.config',
								  'enilia.overlay.dbmanager',
								  'enilia.overlay.navigation',
								  'enilia.overlay.message'])

	.constant('VERSION', '<%= version %>')

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/dpsmeter',
			})
			.when('/404/path/:path*', {
				templateUrl: 'app/Debug/404.html',
				controller: 'e404Controller'
			})
			.otherwise({
				redirectTo: function(params, path, search) {
					return '/404/path/'
						+ path
				}
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

	.controller('overlayController',
		['$scope',
		  '$document',
		  'userManager',
		  'sanitize',
		  '$location',
		  function($scope, $document, userManager, sanitize, $location) {

				$scope.state = { isLocked: true };
				$scope.isLoading = true;
				// $scope.pristine = true;

				$document.on('onOverlayStateUpdate', stateUpdate);
				$document.on('onOverlayDataUpdate', dataUpdate);

				$scope.$on('$locationChangeStart', function() {
					console.log('$locationChangeStart', arguments)
					$scope.isLoading = true;
				})

				$scope.$on('$routeChangeSuccess', function() {
					console.log('$routeChangeSuccess', arguments)
					$scope.isLoading = false;
					$scope.pristine = false;
				})

				$scope.$on('$routeChangeError', function() {
					console.log('$routeChangeError', arguments)
					$scope.isLoading = false;
					$scope.pristine = false;
				})

			    function stateUpdate(e) {
			        $scope.$apply(function() {
			        	$scope.state = e.detail;
			        });
			    }

			    function dataUpdate (e) {
			    	var session = userManager.getSession();
					session.encounter = sanitize(e.detail.Encounter);
					session.combatants = sanitize(e.detail.Combatant);
					session.active = e.detail.isActive;
			    }

			    $scope.setLoading = function setLoading(value) {
			    	$scope.isLoading = value;
			    }

			    $scope.setExpandFromBottom = function setExpandFromBottom(value) {
			    	$scope.expandFromBottom = value;
			    }

			    $scope.getExpandFromBottom = function getExpandFromBottom() {
			    	return userManager.get('expandFromBottom');
			    }
		}])

	.controller('e404Controller',
		['$scope', '$routeParams',
		function e404Controller($scope, $routeParams) {

			$scope.path = $routeParams.path;

		}])

;
