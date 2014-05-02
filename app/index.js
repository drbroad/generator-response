'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Logger = require('../util/logger');
var Settings = require('../util/constants');
var Globals = require('../config');


var ResponseGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		// Log level option
		this.option('log', {
			desc: 'The log verbosity level: [ verbose | log | warn | error | alert ]',
			defaults: 'log',
			alias: 'l',
			name: 'level'
		});

		// Enable advanced features
		this.option('advanced', {
			desc: 'Makes advanced features available',
			alias: 'a'
		});

		// Shortcut for --log=verbose
		this.option('verbose', {
			desc: 'Verbose logging',
			alias: 'v'
		});
		if (this.options.verbose) {
			this.options.log = 'verbose';
		}

		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();

		// Setup the Globals settings
		//this.globals = Globals.getInstance();

		// Log the options
		try {
			this.logger.verbose('\nOptions: ' + JSON.stringify(this.options, null, '  '));
		} catch (e) {
			// This is here because when a generator is run by selecting it after running `yo`,
			// the options is a circular data structure, causing an error when converting to json.
			// Verbose cannot be called this way, so there is no need to log anything.
		}


		/*
		Suspect these should be moved into individual generators - decouple EVERYTHING!
		 */
		this.on('end', function () {
			this.installDependencies({
				bower: true,
				npm: true,
				skipInstall: false,
				callback: function () {
					console.log(chalk.green('Everything is ready! Running grunt build...'));					this.emit('dependenciesInstalled');
				}.bind(this)
			});
		});

		// Now you can bind to the dependencies installed event
		this.on('dependenciesInstalled', function () {
			this.spawnCommand('grunt');
		});
	},

	glob: function () {
		var done = this.async();
		this.invoke('response:config', { args: [], options: this.options }, done);
	},

	setup: function () {
		var welcome =
			chalk.red.bold("\n  _____                                             ") +
			chalk.red.bold("\n |  __ \\                                            ") +
			chalk.red.bold("\n | |__) | ___  ___  _ __    ___   _ __   ___   ___  ") +
			chalk.red.bold("\n |  _  / / _ \\/ __|| '_ \\  / _ \\ | '_ \\ / __| / _ \\ ") +
			chalk.red.bold("\n | | \\ \\|  __/\\__ \\| |_) || (_) || | | |\\__ \\|  __/ ") +
			chalk.red.bold("\n |_|  \\_\\\\___||___/| .__/  \\___/ |_| |_||___/ \\___| ") +
			chalk.red.bold("\n                   | |                              ") +
			chalk.red.bold("\n                   |_|                              ");

		//console.log(welcome);
		this.logger.log('You\'re using the fantastic RespLaravel generator.');
		this.logger.log('Get your project underway with a few taps of your finger!', {seperate: true});
	},

	askFor: function () {
		var done = this.async();

		this.logger.warn('First up, lets figure out what kind of project you need...');

		var prompts = [
			{
				type: 'list',
				name: 'generatorType',
				message: 'What kind of project would you like to generate?',
				choices: [
					{
						name: 'Laravel',
						value: this.settings.getOpt('_TYPE_LARAVEL')
					},
					{
						name: 'HTML Flatfile',
						value: this.settings.getOpt('_TYPE_FLAT')
					},
					{
						name: 'Wordpress',
						value: this.settings.getOpt('_TYPE_WORDPRESS')
					},
					{
						name: 'Email Template',
						value: this.settings.getOpt('_TYPE_EMAIL')
					}
				]
			}
		];

		this.prompt(prompts, function (props) {
			this.env.options = props;
			done();
		}.bind(this));
	},

	clean: function () {
		var done = this.async();
		this.invoke('response:clean', { args: [], options: this.options }, done);
	},

	app: function () {
		var done = this.async();
		var subGenerator;

		switch (this.env.options.generatorType)
		{
			case this.settings.getOpt('_TYPE_LARAVEL'):
				subGenerator = 'response:laravel';
				break;
			case this.settings.getOpt('_TYPE_WORDPRESS'):
				subGenerator = 'response:wordpress';
				break;
			case this.settings.getOpt('_TYPE_EMAIL'):
				subGenerator = 'response:email';
				break;
			case this.settings.getOpt('_TYPE_FLAT'):
				subGenerator = 'response:flat';
				break;
			default:
				subGenerator = 'response:flat';
				break;
		}

		this.settings.set('installType', this.env.options.generatorType);
		this.invoke(subGenerator, {args: [], options: this.options }, done);
		//done();
	},

	projectfiles: function () {
		//console.log(chalk.yellow('MAIN PROJECT FILES...'));
	},

	runtime: function () {
		//console.log(chalk.yellow('MAIN RUNTIME...'));
	}


});

module.exports = ResponseGenerator;
