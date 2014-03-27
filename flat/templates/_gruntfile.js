'use strict';
module.exports = function(grunt) {

	//Initializing the configuration object
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'./www/js/pages/*.js',
			]
		},
		less: {
			dist: {
				files: {
					'www/assets/css/styles.min.css': [
						'www/assets/less/app.less'
					],
				},
				options: {
					compress: true,
					// LESS source map
					// To enable, set sourceMap to true and update sourceMapRootpath based on your install
					sourceMap: true,
					sourceMapFilename: 'assets/css/main.min.css.map',
					sourceMapRootpath: 'www/'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					// COMPONENTS
					'www/assets/js/components.min.js': [
						'<%= bowerDir %>/jquery/jquery.js',
						<% if ( IE8 ){ %>
						'<%= bowerDir %>/respond/src/respond.js',
						<% } %>
						'<%= bowerDir %>/bootstrap/js/transition.js',
						'<%= bowerDir %>/bootstrap/js/alert.js',
						'<%= bowerDir %>/bootstrap/js/button.js',
						'<%= bowerDir %>/bootstrap/js/carousel.js',
						'<%= bowerDir %>/bootstrap/js/collapse.js',
						'<%= bowerDir %>/bootstrap/js/dropdown.js',
						'<%= bowerDir %>/bootstrap/js/modal.js',
						'<%= bowerDir %>/bootstrap/js/tooltip.js',                
						'<%= bowerDir %>/bootstrap/js/scrollspy.js',
						'<%= bowerDir %>/bootstrap/js/tab.js',
						'<%= bowerDir %>/bootstrap/js/affix.js',
					],
					// MAIN SCRIPTS...
					'www/assets/js/main.min.js': [
						'www/assets/scripts/plugins/*.js',
						'www/assets/scripts/main.js'
					],
				}
			}
		},
		phpunit: {
			//...
			options: {}
		},
		watch: {
			less: {
				options: {
					livereload: true
				},
				files: [
					'www/assets/less/**/*.less'

				],
				tasks: ['less'],
			},
			js: {
				options: {
					livereload: true
				},
				files: '<%%= jshint.all %>',
				tasks: ['uglify'],
			},
		}
	});

	// Plugin loading
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Register tasks
	grunt.registerTask('default', [
		'less',
		'uglify',
	]);
	grunt.registerTask('dev', [
		'watch'
	]);

};
