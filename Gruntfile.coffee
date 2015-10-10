
module.exports = (grunt) ->

	grunt.registerTask 'default', [
		'clean',
		'template',
		'copy:assets',
		'ngtemplates',
		'useminPrepare:html',
		'cssmin:generated',
		'uglify:generated',
		'usemin'
	]

	grunt.registerTask 'all', [
		'clean',
		'template',
		'copy',
		'ngtemplates',
		'useminPrepare',
		'cssmin:generated',
		'uglify:generated',
		'usemin'
	]

	grunt.registerTask 'cache', [
		'copy:libs',
		'useminPrepare:cache',
		'uglify:generated',
		'usemin:html'
	]

	require('load-grunt-tasks') grunt

	grunt.initConfig
		config: grunt.file.readJSON('config.json')
		template:
			options:
				data: '<%= config.tokens %>'
			core:
				files: [
					expand: true
					cwd: '<%= config.srcDirectory %>'
					src: ['<%= config.files.core %>']
					dest: '<%= config.outDirectory %>'
				]
		copy:
			assets:
				files: [
					expand: true
					cwd: '<%= config.srcDirectory %>'
					src: ['<%= config.files.assets %>']
					dest: '<%= config.outDirectory %>'
				]
			libs:
				files: [
					expand: true
					cwd: 'bower_components/'
					src: ['<%= config.files.bower %>']
					dest: '<%= config.outDirectory %>/vendor/'
				,
					expand: true
					cwd: 'node_modules/'
					src: ['<%= config.files.node_modules %>']
					dest: '<%= config.outDirectory %>/vendor/'
				]
		ngtemplates:
			app:
				cwd: '<%= config.srcDirectory %>'
				src: '<%= config.templatesRoot %>'
				dest: '<%= config.outDirectory %>/<%= config.templatesOut %>'
				options:
					htmlmin:
						collapseBooleanAttributes:      true
						collapseWhitespace:             true
						removeAttributeQuotes:          true
						removeComments:                 true
						removeEmptyAttributes:          true
						removeRedundantAttributes:      true
						removeScriptTypeAttributes:     true
						removeStyleLinkTypeAttributes:  true
					module: '<%= config.templatesModuleName %>'
					standalone: true
		uglify:
			options:
				sourceMap: true
		useminPrepare:
			html: '<%= config.srcDirectory %>/index.html'
			cache: '<%= config.srcDirectory %>/index.html'
			options:
				dest: '<%= config.outDirectory %>'
				root: '<%= config.outDirectory %>'
				flow:
					cache:
						steps:
							cache: ['uglify']
					steps:
						js: ['uglify']
						css: ['cssmin']
		usemin:
			html: '<%= config.outDirectory %>/index.html'
			css: '<%= config.outDirectory %>/css/app.min.css'
			options:
				assetsDirs: '<%= config.outDirectory %>/vendor'
				patterns:
					css: [
						[/(\.\.\/fonts\/glyphicons-halflings-regular\.)/g,
						'replacing reference to glyphicons-halflings-regular',
						(match) -> "../vendor/bootstrap/dist/fonts/glyphicons-halflings-regular."]
					]
				blockReplacements:
					cache: (block) ->
						'<script src="' + block.dest + '"><\/script>';
		watch:
			options:
				atBegin: true
				spawn: false
			app:
				files: ['<%= config.srcDirectory %>', 'package.json', 'config.json']
				tasks: ['default']
		clean:
			build: ['<%= config.outDirectory %>/*',
					'!<%= config.outDirectory %>/vendor',
					'!<%= config.outDirectory %>/js']
		connect:
			server:
				options:
					port:80
					base: '<%= config.outDirectory %>'
					keepalive: true


	grunt.event.on 'watch', (action, path) ->
		grunt.config 'config', grunt.file.readJSON('config.json')
		grunt.config.merge
			config: tokens: version: grunt.file.readJSON('package.json').version

	grunt.config.merge
		config: tokens: version: grunt.file.readJSON('package.json').version

	null
