
angular.module('enilia.overlay', ['enilia.overlay.tpls'])

	.controller('test', ['$scope','$document', '$location', function($scope, $document, $location) {

		var lastTime = Date.now();

		$scope.location = $location.url();
		$scope.data = "no data";
		$scope.state = { isLocked: true };

		$document.on('onOverlayDataUpdate', dataUpdate);
		$document.on('onOverlayStateUpdate', stateUpdate);

	    function dataUpdate(e) {

	        $scope.data = Date.now() - lastTime;
	        $scope.$apply();
	        lastTime = Date.now();
	    }

	    function stateUpdate(e) {

	        $scope.state = e.detail;
	        $scope.$apply();
	    }

	}])
;