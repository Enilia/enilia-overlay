
path = require 'path'

module.exports = (grunt) ->

	grunt.registerTask 'default', [
		'clean:build',
		'copy:assets',
		'ngtemplates',
		'useminPrepare:html',
		'template',
		'cssmin:generated',
		'uglify:generated',
		'usemin'
	]

	grunt.registerTask 'all', [
		'clean:all',
		'copy',
		'ngtemplates',
		'useminPrepare',
		'template',
		'cssmin:generated',
		'uglify:generated',
		'usemin'
	]

	grunt.registerTask 'cache', [
		'copy:libs',
		'copy:libstransform',
		'useminPrepare:cache',
		'uglify:generated',
		'usemin:html'
	]

	require('load-grunt-tasks') grunt

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		config: grunt.file.readJSON('config.json')
		template:
			options:
				data: '<%= config.tokens %>'
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
					filter: (src) -> return !src.match(/\.css$/)
				,
					expand: true
					cwd: 'node_modules/'
					src: ['<%= config.files.node_modules %>']
					dest: '<%= config.outDirectory %>/vendor/'
				]
			libstransform:
				options:
					process: (content, srcpath) ->
						content.replace ///
							/\*\#\s*			# comment start
							sourceMappingURL=
							[\w.]+				# filename
							\s*\*/				# comment end
							[\s\n]*$			# end of file (whitespace only)
							///, ''
				files: [
					expand: true
					cwd: 'bower_components/'
					src: ['<%= config.files.bower %>']
					dest: '<%= config.outDirectory %>/vendor/'
					filter: (src) -> return !!src.match(/\.css$/)
				]
		ngtemplates:
			app:
				cwd: '<%= config.srcDirectory %>'
				src: '<%= config.templatesRoot %>'
				dest: '<%= config.srcDirectory %>/<%= config.templatesOut %>'
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
		cssmin:
			options:
				sourceMap: true
				root: '<%= config.outDirectory %>/css'
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
						js: [
							name:'template'
							createConfig: (context, block) ->
								cfg =
									files: []

								context.outFiles = []
								context.outDir = grunt.config('config.outDirectory')

								context.inFiles.forEach (fname) ->
									file = path.join context.inDir, fname
									outfile = path.join context.outDir, fname
									cfg.files.push
										src: [file]
										dest: outfile
									context.outFiles.push fname
								cfg

						,	'uglify'
						]
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
				files: ['<%= config.srcDirectory %>/**', 'package.json', 'config.json']
				tasks: ['default']
		clean:
			build: ['<%= config.outDirectory %>/*',
					'!<%= config.outDirectory %>/vendor',
					'!<%= config.outDirectory %>/js']
			all: ['<%= config.outDirectory %>/*']
		connect:
			server:
				options:
					port:80
					base: '<%= config.outDirectory %>'
					keepalive: true
		zip:
			release:
				compression: 'DEFLATE'
				cwd: '<%= config.outDirectory %>'
				src: ['<%= config.outDirectory %>/**',
					  # '!<%= config.outDirectory %>/app/**',
					  '!<%= config.outDirectory %>/vendor/**',
					  # '!<%= config.outDirectory %>/**/*.map',
					  '!<%= config.outDirectory %>/**/*.css',
					  '<%= config.outDirectory %>/**/*.min.css',
					  '<%= config.outDirectory %>/**/*.{eot,svg,ttf,woff,woff2}']
				dest: '<%= config.releaseDirectory %>/<%= pkg.name %>_v<%= pkg.version %>_<%= config.env %>.zip'



	grunt.event.on 'watch', (action, path) ->
		grunt.config 'config', grunt.file.readJSON('config.json')
		grunt.config.merge
			config: tokens: version: grunt.file.readJSON('package.json').version

	grunt.config.merge
		config: tokens: version: grunt.file.readJSON('package.json').version

	null
