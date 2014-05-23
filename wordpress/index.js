'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var shell = require('shelljs');
var Logger = require('../util/logger');
var Settings = require('../util/constants');
var Wordpress = require('../util/wordpress');
var wp = require('wp-util');
var art = require('../util/art');

var WordpressGenerator = yeoman.generators.Base.extend({

	init: function (args , options) {

		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
		this.on('end', function () {
			// do stuff here...
			// delete output .txt
			// composer and bower installs
		});

	},

	commonOptions: function () {
		var done = this.async();
		var me = this;

		me.prompt(require('../util/prompts')(me.options.advanced, me.settings.get()), function (input) {
			me.settings.set(input);
			done();
		}.bind(this));
	},


	askFor: function () {
		var done = this.async();
		var me = this;

		var setOpts = function () {
			me.prompt(require('./prompts')(me.options.advanced, me.settings.get()), function (input) {
				me.prompt([{
					message: 'Does this all look correct?',
					name: 'confirm',
					type: 'confirm'
				}], function (i) {
					if (i.confirm) {
						me.settings.set(input);
						me.input = input;
						done();
					} else {
						console.log();
						setOpts();
					}
				});
			});
		};

		setOpts();
	},

	setHost: function(){
		var done = this.async();
		var me = this;

		me.logger.warn("Before you go on, please make sure you have set up your vhost!");
		me.logger.alert("We will be trying to access: " + me.input.url);
		me.logger.alert("If this isn't set up, the install WILL Fail...");

		var checkHost = function () {
				me.prompt([{
					message	: 'Have you set up your host?',
					name 	: 'confirm',
					type 	: 'confirm'

				}], function (i) {
					if (i.confirm) {
						done();
					} else {
						checkHost();
					}
				});
		};

		checkHost();

	},

	storeOpts: function () {
		var me = this;
		var done = this.async();
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
		me.settings.set(input);
		me.logger.verbose('User Input: ' + JSON.stringify(me.settings.get(), null, '  '));
		//me.logger.log(art.go, {logPrefix: ''});

		this._countdown(done);
		//done();
	},

	_countdown : function (callback) {
		var counter = 4;
		var me = this;

		function decrease() {
			counter --;
			if (counter > 0) {
				switch (counter)
				{
					case 3:
						me.logger.log(art.three, {logPrefix: ''});
						break;
					case 2:
						me.logger.log(art.two, {logPrefix: ''});
						break;
					case 1:
						me.logger.log(art.one, {logPrefix: ''});
						break;
				}
				setTimeout(decrease, 1000);
			}
			else
			{
				callback();
			}
		}
		decrease();
	},

	wordpressInstall: function () {
		var done = this.async();
		var me = this;

		Wordpress.getCurrentVersion( function (err, version){
			me.logger.log('Downloading the latest Version of Wordpress');
			me.remote('wordpress', 'wordpress', version, function(err, remote) {
				remote.bulkDirectory('.', me.settings.get('wpDir'));
				me.logger.log('WordPress installed');
				done();
			});
		});


	},

	removeThemes: function () {
		var me = this;
		if  (me.settings.get('installTheme')) {
			me.logger.log('Deleting the default Wordpress themes');
			shell.rm('-rf', './' + me.settings.get('wpDir') + '/wp-content/themes/*');
		}
	},

	customTheme: function () {
		var done = this.async();
		var me = this;

		if ( me.settings.get('installTheme') ){

			me.logger.log('Downloading and installing your theme');
			// me.tarball("https://github.com/" + me.settings.get('themeUser') + "/" + me.settings.get('themeRepo') + "/tarball/master", 'wp-content/themes/' + me.settings.get('themeDir'), done);

			me.remote(me.settings.get('themeUser'), me.settings.get('themeRepo'), 'master', function(err, remote) {
				remote.bulkDirectory('.', me.settings.get('wpDir') + '/wp-content/themes/' + me.settings.get('themeDir'));
				me.logger.log('Theme installed');
				done();
			});	

		}else{
			// me.logger.log('\n*********************************************************************\n** Downloading and installing your theme **\n********************************************************************');
			// me.tarball('https://wordpress.org/themes/download/twentyfourteen.1.0.zip', 'wp-content/themes/' + me.settings.get('themeDir'), done);
			done();
		}

	},

	// custom dirs
	somethingsDifferent: function () {

		var me = this;
		if (me.settings.get('customDirs')) {
		//if (this.settings.get('submodule') || this.settings.get('customDirs')) {

			var done = me.async();

			me.logger.warn('Copying index.php');
			me.template('index.php.tmpl', 'index.php');
			me.template('composer.json.tmpl', 'composer.json');
			shell.mv('./' + me.settings.get('wpDir') + '/wp-content', './');
			shell.mv('./wp-content', me.settings.get('contentDir') ) 
			done();			
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
			me.settings.set('saltKeys', saltKeys);
			me.logger.verbose('Copying wp-config');
			me.template('wp-config.php.tmpl', 'wp-config.php');
			done();
		});

	},

	// Check that the database exists, create it otherwise
	hazBaseData: function() {

		var done = this.async(),
			me = this;

		//this.wpSite.database.createIfNotExists(function(err) {
		Wordpress.createDBifNotExists(this.settings.get(), function(err) {
			if (err) {
				me.logger.warn('Cannot access database');
				me.logger.warn('Make sure you create the database and update the credentials in the wp-config.php');
			}
			done();
		});

	},

	//move css template and update theme name
	moveCss: function () {
		var me = this;
	    me.logger.alert('Adding theme name to style.cs');
	    shell.exec("sed -i -e 's/.*Theme Name.*/Theme Name: " + me.settings.get('themeName') + "/' ./" + me.settings.get('contentDir') + "/themes/" + me.settings.get('themeDir') + "/style.css")
	    shell.exec("rm -f -r ./" + me.settings.get('contentDir') + "/themes/" + me.settings.get('themeDir') + "/style.css-e")
	},


	//Install Wordpress
	InstallWordpress: function () {
		var done = this.async();
		var me = this;
	   	me.logger.alert('Installing Wordpress');
		Wordpress.installDB(me, me.settings.get(), done);
		this.logger.verbose('DB install complete');
	},

	// Install and activate the theme
	dumbledoreHasStyle: function () {

		var me = this;
		var done = this.async();
		Wordpress.activateTheme(me.settings.get(), done);

	},

	// Setup theme
	dummyYouHaveToPlugItInFirst: function () {

			this.logger.log('Starting theme setup');
			Wordpress.setupTheme(this, this.settings.get(), this.async());
			this.logger.verbose('Theme setup complete');

	}


});

module.exports = WordpressGenerator;
