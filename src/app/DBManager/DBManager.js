;(function() {
	
angular.module('enilia.overlay.dbmanager', ['enilia.overlay.tpls',
											'enilia.overlay.dbmanager.db',
											'ngStorage',
											'ngRoute'])

	.factory('userManager',
		['$localStorage', '$q',
		function userManagerFactory ($storage, $q) {

			var session = {
					encounter:{
						encdps: "0",
						duration: "00:00",
					},
					active: false
				}
			  , isLoading
			  ;
			
			return {
				get: function get(key) {
					return $storage[key];
				},

				set: function set(key, value) {
					$storage[key] = value;
				},

				getSession: function getSession() {
					return session;
				},

				isUserDefined: function isUserDefined () {
					return true;
				},

				load: function() {
					if(isLoading) return $q.reject();
					return isLoading = $q.resolve().then(function () {
						isLoading = false;
					})
				}
			}

		}])

	.factory('presetManager',
		['$localStorage',
		function presetManagerFactory ($storage) {

			function uidTest (uid) {
				return function(preset) {
					return preset.__uid === uid;
				}
			}

			function findPos(preset) {
				return $storage.presets.findIndex(uidTest(preset.__uid));
			}

			return {
				get: function getPreset(uid) {
					uid = uid || $storage.preset;
					return $storage.presets.find(uidTest(uid));
				},

				set: function setPreset(preset) {
					$storage.preset = preset.__uid;
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
					preset.__uid = $storage.__uid++;
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

	.run(['$localStorage', 'VERSION', 'DEFAULT_DB',
		function update($storage, VERSION, DEFAULT_DB) {
			if(!$storage.presets) {
				var __uid = [];
				$storage.$default(DEFAULT_DB);
				angular.forEach($storage.presets, function(preset) {
					__uid[preset.__uid] = null;
				});
				$storage.__uid = __uid.length;
			}
			if($storage.VERSION) {
				var version = $storage.VERSION.match(/(\d+).(\d+).(\d+)(?:-(.+))/)
				  , major = version[1]
				  , minor = version[2]
				  , patch = version[3]
				  , build = version[4]
				  ;

				/* Placeholder for future db patchs */
			}
			$storage.VERSION = VERSION;
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