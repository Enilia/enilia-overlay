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

	.factory('ParseClasses',
		function ParseClassesFactory() {

			Parse.initialize("{#appId#}", "{#jsKey#}");

			[
				[Parse.User, 'config'],
				['UserConfig', 'presetIndex', 'presets', 'expandFromBottom'],
				['Preset', 'name', 'cols']
			].forEach(function(config) {
				var klass = typeof config[0] === "string" ?
						Parse.Object.extend(config[0]) :
						config[0];

				this[klass.className] = klass;

				config.slice(1).forEach(function(prop) {
					Object.defineProperty(klass.prototype, prop, {
						configurable:true,
						enumerable: true,
						get: function() {return this.get(prop)},
						set: function(value) {this.set(prop, value)}
					});
				})
			}, this)
		})

	.provider('userManager', function userManagerProvider() {

		this.load = ['userManager', function (userManager) {
			return userManager.getUser() || userManager.load("Default");
		}]

		this.$get = ['$q', '$rootScope', '$location', 'ParseClasses',
			function userManagerFactory ($q, $rootScope, $location, ParseClasses) {

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
							$rootScope.$broadcast("userChange", _user);
							return user = _user
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
		['userManager', '$rootScope', '$q', 'ParseClasses',
		function presetManagerFactory (userManager, $rootScope, $q, ParseClasses) {
			
			var user = userManager.getUser();

			$rootScope.$on('userChange', function($event, _user) {
				user = _user;
			});

			function idTest (id) {
				return function(preset) {
					return preset.id === id;
				}
			}

			function findPos(preset) {
				return user.config.presets.findIndex(idTest(preset.id));
			}

			return {
				get: function getPreset(id) {
					var config = user.config
					  , presets = config.presets;
					if(!id) return presets[config.presetIndex];
					return presets[presets.findIndex(idTest(id))];
				},

				getClone: function getClone(id) {
					var preset = this.get(id)
					  , clone = preset.clone();
					clone.cols = preset.cols.slice();
					return clone;
				},

				set: function setPreset(preset) {
					user.config.presetIndex = findPos(preset);
					return $q.resolve(user.config.save())
						.then(function() { return preset })
				},

				getAll: function getAllPreset() {
					return user.config.presets;
				},

				update: function updatePreset (preset, values) {
					['name', 'cols'].forEach(function(prop) {
						if(!angular.equals(preset[prop], values[prop])) {
							preset[prop] = values[prop];
						}
					})
					return $q.resolve(preset.save())
				},

				remove: function removePreset (preset) {
					return $q.resolve(preset.destroy())
						.then(function() {
							var index = findPos(preset);
							if(~index) {
								user.config.presets.splice(index, 1)
								return user.config.save();
							}
							return $q.reject();
						})
				},

				add: function addPreset (preset) {
					user.config.presets.push(preset)
					return $q.resolve(user.config.save())
						.then(function() { return preset })

				},

				$getDefault: function $getDefault () {
					return new ParseClasses.Preset({
						name:'DPS',
						cols: [
							{label:  'Name',value: 'name'},
							{label:  'Encdps',value: 'encdps'},
							{label:  'Damage (%)',value: 'damagePct'},
						]
					});
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

			if($storage.VERSION) {

				/* Placeholder for future db patchs */
				if(semver.lt($storage.VERSION, '1.1.0-beta')) {
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