'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var art = require('../util/art');
var wp = require('wp-util');
var Wordpress = require('../util/wordpress');
var Logger = require('../util/logger');
var Config = require('../util/config');
var spawn = require('child_process').spawn;

var WordpressGenerator = yeoman.generators.Base.extend({

	init: function(args, options){

		console.log(this.options);
		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Load the config files
		this.conf = new Config();

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function () {

		});



	},

	wordpressInstall: function () {
		var done = this.async();
		var me = this;

		this.logger.verbose('Getting current WP version');
		Wordpress.getCurrentVersion(function(err, ver) {
			if (err) me.logger.warn('Error getting WP versions.  Falling back to ' + ver);
			me.logger.verbose('Got current WP version: ' + ver);
			me.conf.set('wpVer', ver);
			done();
		});
	},

	// commonOptions: function () {
	// 	var done = this.async();
	// 	var me = this;
	// 	console.log(chalk.magenta('Response:  Opts'));

	// 	me.prompt(prompts(me.options.advanced, me.conf.get()), function (inputs) {
	// 		this.inputs = inputs;
	// 		done();
	// 	}.bind(this));
	// },


	askFor: function () {
		var done = this.async();
		var me = this;

		var setOpts = function () {
			me.prompt(require('./prompts')(me.options.advanced, me.conf.get()), function(input) {
				me.prompt([{
					message: 'Does this all look correct?',
					name: 'confirm',
					type: 'confirm'
				}], function(i) {
					if (i.confirm) {
						me.input = input;
						done();
					} else {
						console.log();
						setOpts();
					}
				});
			});
		}

		setOpts();
	},

	storeOpts: function () {
		var me = this;
		var input = me.input;

		// Set port
		var portRegex = /:[\d]+$/;
		var port = input.url.match(portRegex);
		if (port) input.port = port[0].replace(':', '');

		// Remove port from url
		input.url = input.url.replace(portRegex, '');

		// Set customDirs to true if installing as a submodule
		if (input.submodule) {
			input.customDirs = true;
		}

		// Set dirs if custom dir's is not set
		if (!input.customDirs) {
			input.wpDir = '.';
			input.contentDir = 'wp-content';
		}

		// Save the users input
		me.conf.set(input);
		me.logger.verbose('User Input: ' + JSON.stringify(me.conf.get(), null, '  '));
		me.logger.log(art.go, {logPrefix: ''});

	},

	installation: function () {

		console.log(chalk.cyan('WORDPRESS Install'));

		var done = this.async();
		var me = this;
		var input = me.input;

		// Create a wordpress site instance
		me.wpSite = new wp.Site({
			contentDirectory: input.contentDir,
			wpBaseDirectory: input.wpDir,
			databaseCredentials: {
				host: input.dbHost,
				user: input.dbUser,
				password: input.dbPass,
				name: input.dbName,
				prefix: input.tablePrefix,
			}
		});

		if (this.conf.get('submodule')) {
			this.logger.log('Installing WordPress ' + this.conf.get('wpVer') + ' as a submodule');
			git.submoduleAdd(wordpress.repo, this.conf.get('wpDir'), function(err) {
				if (err) me.logger.error(err);

				me.logger.verbose('Submodule added');
				var cwd = process.cwd();
				git._baseDir = me.conf.get('wpDir');
				me.logger.verbose('Checking out WP version ' + me.conf.get('wpVer'));
				git.checkout(me.conf.get('wpVer'), function(err) {
					if (err) me.logger.error(err);
					git._baseDir = cwd;
					me.logger.verbose('WordPress installed');
					done();
				});
			});

		} else {

			this.logger.log('Installing WordPress ' + this.conf.get('wpVer'));
			this.remote('wordpress', 'wordpress', this.conf.get('wpVer'), function(err, remote) {
				remote.bulkDirectory('.', me.conf.get('wpDir'));
				me.logger.log('WordPress installed');
				done();
			});

		}

		console.log(chalk.cyan('WORDPRESS Install END'));
	},

	// Setup custom directory structure
	somethingsDifferent: function() {

		if (this.conf.get('submodule') || this.conf.get('customDirs')) {

			var me = this,
				done = this.async();

			this.logger.verbose('Copying index.php');
			this.template('index.php.tmpl', 'index.php');
			this.template('composer.json.tmpl', 'composer.json');


			this.logger.log('Setting up the content directory');
			this.remote('wordpress', 'wordpress', this.conf.get('wpVer'), function(err, remote) {
				remote.directory('wp-content', me.conf.get('contentDir'));
				me.logger.verbose('Content directory setup');
				done();
			});
		}
	},

	// wp-config.php
	muHaHaHaConfig: function() {

		var me = this,
			done = this.async();

		this.logger.log('Getting salt keys');
		wp.misc.getSaltKeys(function(err, saltKeys) {
			if (err) {
				me.logger.error('Failed to get salt keys, remember to change them.');
			}
			me.logger.verbose('Salt keys: ' + JSON.stringify(saltKeys, null, '  '));
			me.conf.set('saltKeys', saltKeys);
			me.logger.verbose('Copying wp-config');
			me.template('wp-config.php.tmpl', 'wp-config.php');
			done();
		});

	},

	composeThisBiatch: function () {

		var done = this.async();
		var self = this;
		var composer = spawn('composer', ['update']);


			composer.stdout.on('data', function (data) {
			 console.log(chalk.green('composer: ') + (data.toString().replace(/\n/g, '')));
			});

			composer.stderr.on('data', function (data) {
			  console.log(chalk.red('Content error ') + data, true);
			  // Composer doesn't exist
			});
			composer.stderr.on('close', function (code) {
			  if (!code) {
				console.log(chalk.green('Content installed '));
				done();
			  } else {
				console.log(chalk.red('Content error ') + code);
			  }
			});
	},

	// Install and activate the theme
	dumbledoreHasStyle: function () {

		if (this.conf.get('installTheme')) {
			var me = this,
				done = this.async();

			this.logger.log('Starting to install theme');
			Wordpress.installTheme(this, this.conf.get(), function() {
				/* @TODO You need to run the install before doing this
				   see if I can get yeopress to do that.
			    */
				//wordpress.activateTheme(me.conf.get(), done);
				me.logger.verbose('Theme install complete');
				done();
			});
		}

	},

	// Setup theme
	dummyYouHaveToPlugItInFirst: function () {

		if (this.conf.get('installTheme')) {
			this.logger.log('Starting theme setup');
			Wordpress.setupTheme(this, this.conf.get(), this.async());
			this.logger.verbose('Theme setup complete');
		}

	}

});

module.exports = WordpressGenerator;
