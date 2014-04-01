'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Logger			= require('../util/logger');

var _TYPE_LARAVEL	= 'Laravel';
var _TYPE_FLAT		= 'HTML/Flatfile';
var _TYPE_WORDPRESS	= 'Wordpress';
var _TYPE_EMAIL		= 'Email Campaign';

/**
 * There may be a need for a config dictionary for install types...
 */

// var config =	[

// 					_TYPE_LARAVEL = {

// 					},
// 					_TYPE_FLAT = {

// 					},
// 					_TYPE_WORDPRESS = {

// 					},
// 					_TYPE_EMAIL = {

// 					}

// 				];


var ResponseGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));


		// Log level option
		this.option('log', {
			desc: 'The log verbosity level: [ verbose | log | warn | error ]',
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

	setup: function () {
		var welcome =
			chalk.red("\n  _____                                             ") +
			chalk.red("\n |  __ \\                                            ") +
			chalk.red("\n | |__) | ___  ___  _ __    ___   _ __   ___   ___  ") +
			chalk.red("\n |  _  / / _ \\/ __|| '_ \\  / _ \\ | '_ \\ / __| / _ \\ ") +
			chalk.red("\n | | \\ \\|  __/\\__ \\| |_) || (_) || | | |\\__ \\|  __/ ") +
			chalk.red("\n |_|  \\_\\\\___||___/| .__/  \\___/ |_| |_||___/ \\___| ") +
			chalk.red("\n                   | |                              ") +
			chalk.red("\n                   |_|                              ");

		console.log(welcome);
		this.logger.log('You\'re using the fantastic RespLaravel generator.');
		this.logger.log('Get your project underway with a few taps of your finger!', {seperate: true});
	},

	askFor: function () {
		var done = this.async();

		this.logger.warn('First up, lets figure out what kind of project you need...');

		var prompts = [
			{
				type: "list",
				name: "generatorType",
				message: "What kind of project would you like to generate?",
				choices: [
						{
							name: "Laravel",
							value: _TYPE_LARAVEL
						},{
							name: "HTML Flatfile",
							value: _TYPE_FLAT
						},
						{
							name: "Wordpress",
							value: _TYPE_WORDPRESS
						},{
							name: "Email Template",
							value: _TYPE_EMAIL
						}
				]
			},
			{
				name: "clientName",
				message: 'Who is the client for this project?',
				default: 'Playground'
			},			
			{
				name: "appName",
				message: 'What is the name of this project?',
				default: "Playground"
			}
		];

		this.prompt(prompts, function (props) {
			this.env.options = props;

			// this.jobName = props.jobName;
			// this.author = props.author;
			// this.authorEmail = props.authorEmail;
			// this.jqueryVersion = "~2.1.0";
			// this.bowerDir = props.bowerDir;
			// this.IE8 = props.IE8;

			// if (props.IE8){
			// 	this.jqueryVersion = "1.9.0";
			// }
			this.appName 		= props.appName;
			this.generatorType 	= props.generatorType;

			done();
		}.bind(this));
	},

	clean: function () {
		var done = this.async();
		this.invoke('response:clean', { args: [this.appName], options: this.options }, done);
	},

	app: function () {
		var done = this.async();
		var subGenerator;

		switch (this.generatorType)
		{
			case _TYPE_LARAVEL:
				subGenerator = 'response:laravel';
				break;
			case _TYPE_WORDPRESS:
				subGenerator = 'response:wordpress';
				break;
			case _TYPE_EMAIL:
				subGenerator = 'response:email';
				break;
			case _TYPE_FLAT:
				subGenerator = 'response:flat';
				break;
			default:
				subGenerator = 'response:flat';
				break;
		}

		this.invoke(subGenerator, { args: [ this.appName ], options: this.options }, done);
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
