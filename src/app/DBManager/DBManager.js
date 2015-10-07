;(function() {
	
angular.module('enilia.overlay.dbmanager', ['enilia.overlay.tpls',
											'ngStorage'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/user/load/:userName', {
				templateUrl: 'app/DBManager/partials/load.html',
				controller: 'loadUserController',
				resolve: {
					user: ['$route', 'userManager',
						function($route, userManager) {
							return userManager.load($route.current.params.userName)
						}],
				},
			})
			.when('/user/:user/not/found', {
				templateUrl: 'app/DBManager/partials/userNotFound.html',
				controller: 'userNotFoundController',
			})
	}])

	.controller('loadUserController',
		['$location',
		function loadUserController($location) {
			$location.path('/')
		}])

	.provider('userManager', function userManagerProvider() {

		Parse.initialize("LskqcGbieZk8smuFlbNG6BvgOYs1PGmB0WonWo13", "x1HImL2Ezwm1SWFyPjSNNeW5BgV3sDX41U61mCZd");

		this.load = ['userManager', function (userManager) {
			return userManager.getUser() || userManager.load("Default");
		}]

		this.$get = ['$localStorage', '$q', '$rootScope', '$location',
			function userManagerFactory ($storage, $q, $rootScope, $location) {

				var session = {
						encounter:{
							encdps: "0",
							duration: "00:00",
						},
						active: false
					}
				  , isLoading
				  , user
				  ;
				
				return {
					get: function get(key) {
						return user && user.get(key);
					},

					set: function set(key, value) {
						user && user.set(key, value);
						this.save();
					},

					getSession: function getSession() {
						return session;
					},

					getUser: function getUser() {
						return user;
					},

					save: function save() {
						if(user.authenticated())
							return $q.resolve(user.save());
						$q.reject(new this.UserNotAuthenticatedError());
					},

					load: function(userName) {

						if(this.get('username') === userName){
							return $q.resolve(user);
						}

						function innerLoad() {
							return $q.resolve(new Parse.Query(Parse.User)
								.include("config.presets")
								.equalTo("username", userName)
								.first());
						}

						isLoading = isLoading ? isLoading.then(innerLoad) : innerLoad();

						return isLoading.then(function(_user) {
							if(!_user) {
								$location.path('/user/'+userName+'/not/found');
								return $q.reject(new this.UserNotFoundError(userName));
							}
							// console.log(_user)
							return $rootScope.user = user = _user
						}.bind(this)).finally(function() {
							isLoading = false;
						})
					},

					UserNotFoundError: function UserNotFoundError(_user) {
						this.constructor.prototype.__proto__ = Error.prototype
						Error.call(this)
						Error.captureStackTrace(this, this.constructor)
						this.name = this.constructor.name;
						this.message = "user not found: " + _user;
					},

					UserNotAuthenticatedError: function UserNotAuthenticatedError() {
						this.constructor.prototype.__proto__ = Error.prototype
						Error.call(this)
						Error.captureStackTrace(this, this.constructor)
						this.name = this.constructor.name;
						this.message = "user not authenticated";
					},
				}



			}]

	})

	.factory('presetManager',
		['$localStorage', 'userManager',
		function presetManagerFactory ($storage, userManager) {

			function idTest (id) {
				return function(preset) {
					return preset.id === id;
				}
			}

			function findPos(preset) {
				return $storage.presets.findIndex(idTest(preset.id));
			}

			return {
				get: function getPreset(id) {
					id = id || $storage.preset;
					return $storage.presets.find(idTest(id));
				},

				set: function setPreset(preset) {
					$storage.preset = preset.id;
					return preset;
				},

				getAll: function getAllPreset() {
					return $storage.presets;
				},

				update: function updatePreset (preset) {
					var index = findPos(preset);
					return ~index && $storage.presets.splice(index, 1, preset) && preset;
				},

				remove: function removePreset (preset) {
					var index = findPos(preset);
					return ~index && $storage.presets.splice(index, 1)[0];
				},

				add: function addPreset (preset) {
					preset.id = $storage.id++;
					return $storage.presets.push(preset) && preset;
				},

				$getDefault: function $getDefault () {
					return {
						name:'DPS',
						cols: [
							{label:  'Name',value: 'name'},
							{label:  'Encdps',value: 'encdps'},
							{label:  'Damage (%)',value: 'damagePct'},
						]
					}
				}
			}
		}])

	.controller('userNotFoundController',
		['$scope', '$routeParams',
		function userNotFoundController($scope, $routeParams) {

			$scope.user = $routeParams.user;

		}])

	.run(['$localStorage', 'VERSION',
		function update($storage, VERSION) {

			Parse.initialize("{#appId#}", "{#jsKey#}");

			if($storage.VERSION) {

				/* Placeholder for future db patchs */
				if(semver.lt($storage.VERSION, '1.1.0')) {
					angular.forEach($storage.presets, function(preset) {
						preset.id = preset.__uid;
						delete preset.__uid;
					});
					$storage.id = $storage.__uid;
					delete $storage.__uid;
					$storage.VERSION = VERSION;
				}

			} else {
				$storage.$reset({
					id:3,
					preset: 1,
					presets: [
						{
							id:1,
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
							id:2,
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

	.run(function() {

	  if (!Array.prototype.findIndex) {
	    Array.prototype.findIndex = function(predicate) {
	      if (this == null) {
	        throw new TypeError('Array.prototype.findIndex appelé sur null ou undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate doit être une fonction');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return i;
	        }
	      }
	      return -1;
	    };
	  }

	  if (!Array.prototype.find) {
	    Array.prototype.find = function(predicate) {
	      if (this == null) {
	        throw new TypeError('Array.prototype.find a été appelé sur null ou undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate doit être une fonction');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return value;
	        }
	      }
	      return undefined;
	    };
	  }

	})

})();