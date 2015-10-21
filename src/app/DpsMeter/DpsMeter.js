;(function() {

angular.module('enilia.overlay.dpsmeter', ['ngRoute',
										   'ngStorage',
										   'enilia.overlay.tpls',
										   'enilia.overlay.dbmanager',
										   'enilia.overlay.navigation'])

	.config(['$routeProvider', 'userManagerProvider',
		function($routeProvider, userManagerProvider) {
			$routeProvider
				.when('/dpsmeter', {
					templateUrl: 'app/DpsMeter/dpsmeter.html',
					controller: 'dpsmeterController',
					resolve: {
						user: userManagerProvider.load,
					},
				})
	}])

	.controller('dpsmeterController',
		['$scope', '$document', 'userManager',
		function dpsmeterController($scope, $document, userManager) {

			var session = userManager.getSession();

			$scope.setExpandFromBottom($scope.getExpandFromBottom());

			$scope.encounter = session.encounter;
			$scope.combatants = session.combatants;
			$scope.active = session.active;

			$document.on('onOverlayDataUpdate', dataUpdate);

			$scope.$on('$routeChangeStart', function $destroy() {
				if($scope.expandFromBottom !== userManager.get('expandFromBottom'))
					userManager.set('expandFromBottom', $scope.expandFromBottom);
				$scope.setExpandFromBottom(false);
				$document.off('onOverlayDataUpdate', dataUpdate);
			});

			function dataUpdate(e) {
				$scope.$apply(function() {
					$scope.encounter = session.encounter;
					$scope.combatants = session.combatants;
					$scope.active = session.active;
				});
			}

		}])

	.controller('EncounterController',
		['$scope',
		function EncounterController($scope) {

		}])

	.controller('CombatantsController',
		['$scope', 'presetManager',
		function CombatantsController($scope, presetManager) {

			$scope.headers = presetManager.get().cols.slice();

			$scope.$watch('combatants', update);

			function update() {

				$scope.bestdps = 0

				angular.forEach($scope.combatants, function(combatant) {
					var index;

					$scope.bestdps = Math.max($scope.bestdps, parseFloat(combatant.encdps))

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
				});

			}

		}])

	.directive('encounter', function encounterDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/encounter.html',
			controller:'EncounterController',
			scope:{
				encounter:'=',
				active:'='
			},
		}
	})

	.directive('combatants', function combatantsDirective() {
		return {
			restrict: 'E',
			templateUrl:'app/DpsMeter/partials/combatants.html',
			controller:'CombatantsController',
			scope:{
				combatants:'='
			},
		}
	})

	.directive('bestdps', function bestdpsDirective() {
		return {
			restrict: 'A',
			link:function bestdpsLink(scope, element) {
				scope.$watchGroup(['bestdps', 'combatant.encdps'], update);
				function update() {
					var stop = Math.max(10, parseFloat(scope.combatant.encdps) * 100 / scope.bestdps);
					element.css('background-size', stop + "% 100%, 100%");
				}
			}
		}
	})

	.directive('sortIndex',
		['$animateCss',
		function sortIndexDirective($animateCss) {
			return {
				restrict: 'A',
				scope: {
					sortIndex:"=",
				},
				link:function sortIndexLink(scope, element) {
					scope.$watch('sortIndex', update);
					function update(newIndex, lastIndex) {
						if(lastIndex - newIndex)
							$animateCss(element, {
								easing:'linear',
								from:{
									position:'relative',
									top: (lastIndex - newIndex) * 1.36 + 'em',
								},
								to:{
									position:'relative',
									top: '0',
								},
								duration: 0.5
							}).start()
					}
				}
			}
		}])

	.directive('graph', function graphDirective() {
		return {
			restrict: 'AE',
			scope: {
				foreground:"=",
				background:"=",
			},
			link:function graphLink(scope, element) {
				var data = []
				  , now = Date.now()
				  , width = element.parent()[0].offsetWidth
				  , height = element.parent()[0].offsetHeight
				  , svg = d3.select(element[0])
							.attr('width', '100%')
							.attr('height', '100%')
				  , x = d3.scale.linear()
				  		  .domain([now - 30000, now])
				  		  .range([0, width])
		  		  , y = d3.scale.linear()
		  		  		  .range([height, 0])
  		  		  , area = d3.svg.area()
  		  		  			 .x(function(d) { return x(d[0]) })
  		  		  			 .y0(height)
  		  		  			 .y1(function(d) { return y(d[2]) })
  		  		  , line = d3.svg.line()
  		  		  			 .interpolate('basic')
  		  		  			 .x(function(d) { return x(d[0]) })
  		  		  			 .y(function(d) { return y(d[1]) })
  		  		  , wArea = svg.append('g')
	  			  			   .attr('transform', 'translate(0,0)')
	  			  			   .append('path')
	  			  			   	.attr('class', 'area')
	  			  , yLine = svg.append('g')
	  			  			   .attr('transform', 'translate(0,0)')
	  			  			   .append('path')
	  			  			   	.attr('class', 'line')
				  ;

				scope.$watch('foreground', update);

				function update() {
					var now = Date.now()
					  , shift = x(x.domain()[1]) - x(now)
					  , width = element.parent()[0].offsetWidth
					  , height = element.parent()[0].offsetHeight
					  ;

					x.range([0, width])

					data.push([now, scope.foreground, scope.background])

					wArea.attr("d", area(data))
						 .attr('transform', null)
						 .transition()
						 	.duration(250)
						 	.ease('linear')
						 	.attr('transform', 'translate('+shift+',0)')

					yLine.attr('d', line(data))
						 .attr('transform', null)
						 .transition()
						 	.duration(250)
						 	.ease('linear')
						 	.attr('transform', 'translate('+shift+',0)')

				 	x.domain([now - 30000, now])
				 	y.domain([
				 		d3.min(data, function(d) { return Math.min(d[1], d[2]) * 0.85 }),
				 		d3.max(data, function(d) { return Math.max(d[1], d[2]) * 1.15 })
			 		])

			 		data = data.filter(function(v) {
			 			return v[0] >= (now - 32000)
			 		})
				}

			}
		}
	})

})();
