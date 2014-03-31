'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var prompts = require('../util/prompts');
var Logger = require('../util/logger');
var Config = require('../util/config');

var FlatfileGenerator = yeoman.generators.Base.extend({
	init: function () {

		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Load the config files
		this.conf = new Config();

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		this.on('end', function () {
			// this.installDependencies({
			// 	bower: true,
			// 	npm: true,
			// 	skipInstall: false,
			// 	callback: function () {
			// 		console.log(chalk.magenta ( 'Everything is ready! Running grunt build...') );
			// 		this.emit('dependenciesInstalled');
			// 	}.bind(this)
			// });
		});

		// Now you can bind to the dependencies installed event
		this.on('dependenciesInstalled', function() {
			this.spawnCommand('grunt');
		});
	},

	commonPrompts: function () {
		var done = this.async();
		var me = this;
		console.log(chalk.magenta('Response:  Opts'));

		var setOpts = function () {
		console.log(chalk.magenta('Response:  setOpts'));

			me.prompt(prompts(me.options.advanced, me.conf.get()), function(input) {
				done();
			});
		}

		setOpts();
	},

	askFor: function () {
		var done = this.async();
		console.log(chalk.magenta('Response:  Create a flatfile website.'));

		var prompts = [
			{
				name: "jobName",
				message: "What would you like to call this project?",
			},
			{
				name: "author",
				message: "What is the authors (your) name?",
				default: "Marc Broad"
			},
			{
				name: "authorEmail",
				message: "What is your email?",
				default: "mbroad@thepowertoprovoke.com"
			},
			{
				type: "confirm",
				name: "IE8",
				message: "Do you need IE8 support (jquery 1.9, respond.js) ?",
				default: false
			},
			{
				name: "bowerDir",
				message: "What directory would you like bower to install components to?",
				default: "vendor"
			},
		];

		this.prompt(prompts, function (props) {
			this.jobName = props.jobName;
			this.author = props.author;
			this.authorEmail = props.authorEmail;
			this.jqueryVersion = "~2.1.0";
			this.bowerDir = props.bowerDir;
			this.IE8 = props.IE8;

			if (props.IE8){
				this.jqueryVersion = "1.9.0";
			}

			done();
		}.bind(this));
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
