
Parse.Cloud.define("Signup", function(request, response) {

	Parse.Cloud.useMasterKey();

	Parse.User.signUp(request.params.username, request.params.password)
		.then(function(user) {
			var from = Parse.Query.or(
					new Parse.Query(Parse.User)
						.equalTo("username", request.params.fromuser),
					new Parse.Query(Parse.User)
						.equalTo("username", "Default")
				).addDescending('createdAt')
				.include("config.presets")
				.first();

			return from.then(function(fromuser) {
				var Config = Parse.Object.extend('UserConfig')
				  , Preset = Parse.Object.extend('Preset')
				  , fromConfig = fromuser.get('config')
				  , cloneConfig = new Config()
				  , acl = new Parse.ACL(user)
				  , presets
				  ;

				acl.setPublicReadAccess(true);

				cloneConfig.setACL(acl);
				cloneConfig.set('presetIndex', fromConfig.get('presetIndex'))
				cloneConfig.set('expandFromBottom', fromConfig.get('expandFromBottom'))
				presets = fromConfig.get('presets').map(function (fromPreset) {
					var preset = new Preset();
					preset.setACL(acl);
					preset.set('name', fromPreset.get('name'));
					preset.set('cols', fromPreset.get('cols').slice());
					return preset;
				});

				return Parse.Object.saveAll(presets.concat(cloneConfig))
				.then(function() {
					cloneConfig.set('presets', presets);
					user.set('config', cloneConfig);
					return Parse.Object.saveAll([user, cloneConfig])
					.then(function() {
						response.success(user.getSessionToken());
					})
				})
				.fail(function(e) {
					Parse.Object.destroyAll(presets.concat(cloneConfig))
					return Parse.Promise.error(e)
				});
			})
			.fail(function(e) {
				user.destroy();
				return Parse.Promise.error(e)
			})
		}).fail(function(e) {
			response.error(e.message)
		})

})
