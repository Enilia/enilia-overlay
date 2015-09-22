
angular.module('enilia.overlay', ['ngRoute',
								  'ngStorage',
								  'enilia.overlay.tpls',
								  'enilia.overlay.dpsmeter',
								  'enilia.overlay.config'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/config',
			})
			.otherwise({
				templateUrl: 'app/Debug/debug.html',
				controller: 'debugController'
			});
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

			    $scope.setExpandFromBottom = function(set) {
			    	$scope.expandFromBottom = set;
			    }

			    $scope.getExpandFromBottom = function() {
			    	return $scope.expandFromBottom;
			    }
		}])

	// .controller('stateWatcherController',
	// 	['$scope', '$document', '$localStorage',
	// 	function($scope, $document, $storage) {

	// 		$storage.$default({
	// 		    expandFromBottom: false
	// 		});

	// 		$scope.state = { isLocked: true };
	// 		$scope.expandFromBottom = $storage.expandFromBottom;

	// 		$document.on('onOverlayStateUpdate', stateUpdate);

	// 	    function stateUpdate(e) {

	// 	        $scope.state = e.detail;
	// 	        $scope.$apply();
	// 	    }

	// 	    $scope.setExpandFromBottom = function(set) {
	// 	    	$scope.expandFromBottom = set;
	// 	    }

	// 	    $scope.getExpandFromBottom = function() {
	// 	    	return $scope.expandFromBottom;
	// 	    }

	// 	}])

	.controller('debugController',
		['$scope', '$location',
		function($scope, $location) {

			$scope.loc = $location;

		}])

;