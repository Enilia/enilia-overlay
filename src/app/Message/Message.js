;(function() {
	
angular.module('enilia.overlay.message', ['ngRoute',
										  'enilia.overlay.tpls'])

	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/messages', {
					templateUrl: 'app/Message/message.html',
					controller: 'messageController',
				})
	}])

	.factory('message', ['$rootScope',
		function messageFactory($rootScope) {

			var messages = []
			  , unread = 0
			  ;

			function Message(title, content) {
				messages.push({
					title : title,
					content: content,
					read: false,
					date: Date.now(),
				});
				unread++;

				$rootScope.$broadcast('message');
			}

			Message.getLength = function getLength() {
				return unread;
			}

			Message.remove = function remove(message) {
				var index = messages.indexOf(message);
				if(~index) {
					messages.splice(index, 1);
					// unread--;
				}
			}

			Message.getMessages = function getMessages() {
				return messages;
			}

			Message.read = function read() {
				unread = 0;
				$rootScope.$broadcast('read');
			}
			
			return Message
		}])

	.controller('messageController', [ '$scope', 'message',
		function messageController($scope, message) {
			message.read();
			$scope.messages = message.getMessages();
			$scope.remove = message.remove;
		}])

	.directive('message', [
		function messageDirective() {

			return {
				restrict: 'E',
				templateUrl:'app/Message/partials/menuicon.html',
				scope: {},
				controller:[ '$scope', 'message',
					function messageController($scope, message) {

						update();
						$scope.$on('message', update);
						$scope.$on('read', update);

						function update() {
							$scope.message = Math.min(message.getLength(), 9) || '';
							$scope.plus = message.getLength() > 9;
						}
					}],
			}
		}])

})();