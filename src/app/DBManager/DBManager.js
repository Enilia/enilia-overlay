;(function() {

	// var DEFAULT_USER = "dede";
	var DEFAULT_USER = "Default";

angular.module('enilia.overlay.dbmanager', ['enilia.overlay.tpls',
											'ngStorage'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/u/:userName', {
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
			.when('/user/login/return_url/:path*', {
				templateUrl: 'app/DBManager/partials/userLogin.html',
				controller: 'userLoginController',
			})
	}])

	.controller('loadUserController',
		['$location',
		function loadUserController($location) {
			$location.path('/')
		}])

	.factory('ParseClasses',
		function ParseClassesFactory() {

			var ParseClasses = {}
			  , presetProto = {
			  	clone: function clone() {
			  		var clone = Parse.Object.prototype.clone.apply(this, arguments);
			  		clone.cols = angular.copy(this.cols);
			  		return clone;
			  	}
			  };

			Parse.initialize("<%= appId %>", "<%= jsKey %>");

			[
				[Parse.User, ['config']],
				['UserConfig', ['presetIndex', 'presets', 'expandFromBottom']],
				['Preset', ['name', 'cols'], presetProto]
			].forEach(function(config) {
				var klass = typeof config[0] === "string" ?
						Parse.Object.extend(config[0], config[2]) :
						config[0];

				ParseClasses[klass.className] = klass;

				config[1].forEach(function(prop) {
					Object.defineProperty(klass.prototype, prop, {
						configurable:true,
						enumerable: true,
						get: function() {return this.get(prop)},
						set: function(value) {this.set(prop, value)}
					});
				})
			})

			return ParseClasses;
		})

	.provider('userManager', function userManagerProvider() {

		this.load = ['userManager', function (userManager) {
			return userManager.getUser() ||
					userManager.load(Parse.User.current() || DEFAULT_USER);
		}]

		this.logIn = ['userManager', '$q', '$location',
		function (userManager, $q, $location) {
			return $q(function(resolve, reject) {
				if(userManager.isAuthenticated()) {
					resolve()
				} else {
					reject()
					$location.path('/user/login/return_url/'+$location.path())
				}
			})
		}]

		this.$get = ['$q', '$rootScope', '$location', 'ParseClasses', 'message',
			function userManagerFactory ($q, $rootScope, $location, ParseClasses, message) {

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
						return user && user.config.get(key);
					},

					set: function set(key, value) {
						user && user.config.set(key, value);
						this.isAuthenticated() && this.save().catch(function (e) {
							message('userManager.set', 'could not save {'+key+'} whith value {'+value+'}',
								e)
						});
					},

					getSession: function getSession() {
						return session;
					},

					getUser: function getUser() {
						return user;
					},

					isAuthenticated: function isAuthenticated() {
						return user && user.authenticated();
					},

					save: function save() {
						if(user.authenticated())
							return $q.resolve(user.config.save());
						return $q.reject(new this.UserNotAuthenticatedError());
					},

					load: function(userName) {

						if(userName instanceof Parse.User) userName = userName.getUsername();

						if(user && user.getUsername() === userName){
							return $q.resolve(user);
						}

						function innerLoad() {
							return $q.resolve(new Parse.Query(Parse.User)
								.include("config.presets")
								.equalTo("username", userName)
								.first()).catch(function(e) {
									message('userManager.load',
										'Could not load user {'+userName+'}',
										e)
									return $q.reject(e);
								});
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

					logIn: function logIn(name, pass) {
						return $q.resolve(Parse.User.logIn(name, pass))
							.then(this.load.bind(this))
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
		['userManager', '$rootScope', '$q', 'ParseClasses', 'message',
		function presetManagerFactory (userManager, $rootScope, $q, ParseClasses, message) {

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
					return clone;
				},

				set: function setPreset(preset) {
					var pos = findPos(preset);
					if(user.config.presetIndex === pos) return;
					user.config.presetIndex = pos;
					return userManager.isAuthenticated() && $q.resolve(user.config.save())
						.then(function() { return preset })
						.catch(function(e) {
							message('presetManager.set',
								'could not save preset {'+preset.id+'} at index {'+pos+'}',
								e)
							return $q.reject(e);
						}) || $q.resolve();
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
					preset.cols.forEach(function(col) {
						delete col.$$hashKey;
					})
					return $q.resolve(preset.save())
						.catch(function(e) {
							console.log(values);
							message('presetManager.update',
								'could not update preset {'+preset.id+'} with values {'+angular.toJson(values, true)+'}',
								e)
							return $q.reject(e);
						})
				},

				remove: function removePreset (preset) {
					return $q.resolve(preset.destroy())
						.then(function() {
							var index = findPos(preset);
							if(~index) {
								user.config.presets.splice(index, 1);
								user.config.presets = user.config.presets;
								return user.config.save();
							}
							return $q.reject({message:'no index found for {'+preset.id+'}'});
						})
						.catch(function(e) {
							message('presetManager.remove',
								'could not remove preset {'+preset.id+'}',
								e)
							return $q.reject(e);
						})
				},

				add: function addPreset (preset) {
					preset.cols.forEach(function(col) {
						delete col.$$hashKey;
					})
					return $q.resolve(preset.save())
						.then(function() {
							user.config.presets.push(preset)
							return user.config.save()
						})
						.then(function() { return preset })
						.catch(function(e) {
							message('presetManager.add',
								'could not add preset {'+preset.id+'}',
								e)
							return $q.reject(e);
						})
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

	.controller('userLoginController',
		['$scope', 'userManager', '$location', '$routeParams',
		function userLoginController($scope, userManager, $location, $routeParams) {
			var fromUser = userManager.getUser().get('username')
			$scope.username = fromUser;

			$scope.login = function login($event) {
				userManager.logIn($scope.username, $scope.password)
					.then(function() {
						if($routeParams.path && $scope.username === fromUser)
							$location.path($routeParams.path)
						else
							$location.path('/')
					})
					.catch(function(e) {
						$scope.errorMessage = e.message
					})
			}
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

	  if (!XMLHttpRequest.prototype.toJSON) {
	  	XMLHttpRequest.prototype.toJSON = function() {
	  	    return {
	  	        readyState: this.readyState,
	  	        response: this.response,
	  	        responseText: this.responseText,
	  	        responseType: this.responseType,
	  	        responseURL: this.responseURL,
	  	        status: this.status,
	  	        statusText: this.statusText
	  	    }
	  	}
	  }

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
