//'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var shell = require('shelljs');
var Logger = require('../util/logger');
var Settings = require('../util/constants');
var art = require('../util/art');

var WordpressGenerator = yeoman.generators.Base.extend({

	init: function(args, options){

		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function () {

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

		//this._countdown(done);
		done();
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

		me.logger.log('\n*************************************************\n** Downloading the latest Version of Wordpress **\n*************************************************');
		//me.tarball('http://wordpress.org/latest.zip', './', done);

		me.remote('wordpress', 'wordpress', 'master', function(err, remote) {
			remote.bulkDirectory('.', me.settings.get('wpDir'));
			me.logger.log('WordPress installed');
			done();
		});		
	},

	removeThemes: function () {
		var me = this;
	    me.logger.log('\n*******************************************\n** Deleting the default Wordpress themes **\n*******************************************');
	    shell.rm('-rf', './' + me.settings.get('wpDir') + '/wp-content/themes/*');
	},	

	customTheme: function () {
		var done = this.async();
		var me = this;

	    if( me.settings.get('installTheme') ){

	        me.logger.log('\n*********************************************************************\n** Downloading and installing your theme **\n********************************************************************');
	        // me.tarball("https://github.com/" + me.settings.get('themeUser') + "/" + me.settings.get('themeRepo') + "/tarball/master", 'wp-content/themes/' + me.settings.get('themeDir'), done);

			me.remote(me.settings.get('themeUser'), me.settings.get('themeRepo'), 'master', function(err, remote) {
				remote.bulkDirectory('.', me.settings.get('wpDir') + '/wp-content/themes/' + me.settings.get('themeDir'));
				me.logger.log('Theme installed');
				done();
			});		        
	    }else{
	        me.logger.log('\n*********************************************************************\n** Downloading and installing your theme **\n********************************************************************');
	        me.tarball('https://wordpress.org/themes/download/twentyfourteen.1.0.zip', 'wp-content/themes/' + me.settings.get('themeDir'), done);
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
			shell.mkdir(me.settings.get('contentDir'));
			me.directory(me.settings.get('wpDir') + '/wp-content', me.settings.get('contentDir'));
			shell.rm('-r', './' + me.settings.get('wpDir') + '/wp-content');
			done();			
		}	
	}

});

module.exports = WordpressGenerator;
