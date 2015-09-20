
angular.module('enilia.overlay', ['enilia.overlay.tpls'])

	.controller('stateWatcherController', ['$scope','$document', function($scope, $document) {

		$scope.state = { isLocked: true };

		// $document.on('onOverlayDataUpdate', dataUpdate);
		$document.on('onOverlayStateUpdate', stateUpdate);

	    function stateUpdate(e) {

	        $scope.state = e.detail;
	        $scope.$apply();
	    }

	}])
;