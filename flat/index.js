'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var prompts = require('../util/prompts');
var Logger = require('../util/logger');
var Config = require('../util/config');
var Settings = require('../util/constants');
var art = require('../util/art');

var FlatfileGenerator = yeoman.generators.Base.extend({
	init: function () {

		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();

		// Load the config files
		this.conf = new Config();

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function () {
			this.installDependencies({
				bower: true,
				npm: true,
				skipInstall: false,
				callback: function () {
					console.log(chalk.magenta ( 'Everything is ready! Running grunt build...') );
					this.emit('dependenciesInstalled');
				}.bind(this)
			});
		});

		// Now you can bind to the dependencies installed event
		this.on('dependenciesInstalled', function () {
			this.spawnCommand('grunt');
		});
	},

	commonOptions: function () {
		var done = this.async();
		var me = this;

		me.prompt(prompts(me.options.advanced, me.conf.get()), function (inputs) {
			var type = this.env.options.generatorType;
			this.env.options[type] = inputs;
			me.settings.set(inputs);
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

	countdownEnginesOn: function () {
		var done = this.async();
		var me = this;		
		this._countdown(done);
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

	app: function () {
		this.mkdir('www');
		this.mkdir('www/assets');
		this.mkdir('www/assets/js');
		this.mkdir('www/assets/scripts/plugins');

		this.mkdir('www/assets/scripts');
		this.mkdir('www/assets/css');
		this.mkdir('www/assets/img');
		this.mkdir('www/assets/less');
		this.mkdir('www/assets/less/partials');
		this.mkdir('www/assets/fonts');

		this.template('_index.md', 'index.md');
		this.template('_gruntfile.js', 'Gruntfile.js');
		this.template('_index.html', 'www/index.html');
		this.template('assets/less/app.less', 'www/assets/less/app.less');
		this.copy('assets/less/partials/variables.less', 'www/assets/less/partials/variables.less');
		this.copy('assets/js/main.js', 'www/assets/scripts/main.js');
		this.template('_bowerrc', '.bowerrc');
		this.template('_bower.json', 'bower.json');
		this.template('_package.json', 'package.json');

	},

	projectfiles: function () {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	},

	runtime: function (){
		this.copy('gitignore', '.gitignore');
	}


});

module.exports = FlatfileGenerator;
