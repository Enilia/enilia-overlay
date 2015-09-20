angular.module('enilia.overlay.controllers.dpsmeterController', [])

	.controller('dpsmeterController', ['$scope', '$interval', '$document', function($scope, $interval, $document) {

		$document.on('onOverlayDataUpdate', dataUpdate);

		function dataUpdate() {
			$scope.$apply();
		}

	}])