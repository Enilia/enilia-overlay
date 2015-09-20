
angular.module('enilia.overlay.controllers.stateWatcherController', [])

	.controller('stateWatcherController',
		['$scope', '$document', '$location',
		function($scope, $document, $location) {

			$scope.state = { isLocked: true };
			// $scope.loc = $location;

			// $document.on('onOverlayDataUpdate', dataUpdate);
			$document.on('onOverlayStateUpdate', stateUpdate);

		    function stateUpdate(e) {

		        $scope.state = e.detail;
		        $scope.$apply();
		    }

		}])