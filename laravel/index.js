'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var rimraf = require('rimraf');
var q = require('q');
var _ = require('underscore');
var	spawn = require('child_process').spawn;

var LaravelGenerator = yeoman.generators.NamedBase.extend({

	init: function(args, options){
		console.log('You called the post subgenerator with the argument ' + this.name + '.');

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
		this.on('end', function () {

		});
	},

	askFor: function () {
		var done = this.async();
		var prompts = [
			{
				name: 'bowerDir',
				message: 'What directory would you like bower to install components to?',
				default: 'vendor'
			},
		];

		this.prompt(prompts, function (props) {
			done();
		}.bind(this));
	},

	checkComposer: function () {
		var done = this.async();
		var composer = spawn('composer');
		var self = this;

		composer.stdout.on('data', function () {
		console.log(chalk.green('Composer has been found'));

		self.composer = true;
		done();
		});

		composer.stderr.on('data', function () {
		console.log(chalk.red('Composer is missing'));
		// Composer doesn't exist
		});
	},

	laravelInstall: function () {
	  var done = this.async();
	  console.log(chalk.cyan('LARAVEL Install'));

	  if (this.composer) {

	    var composer = spawn('composer', ['create-project', 'laravel/laravel', '--prefer-dist', './'], {killSignal: 'SIGINT'}),
	        self = this;

	    composer.stdout.on('data', function (data) {
	     console.log(chalk.green('composer: ') + (data.toString().replace(/\n/g, '')));
	    });

	    composer.stderr.on('data', function (data) {
	      console.log(chalk.red('Laravel error ') + data, true);
	      // Composer doesn't exist
	    });
	    composer.stderr.on('close', function (code) {
	      if (!code) {
	        console.log(chalk.green('Laravel installed '));
	        done();
	      } else {
	        console.log(chalk.red('Laravel error ') + code);
	      }
	    });
	  }
	}	


});

module.exports = LaravelGenerator;

// var LaravelGenerator = module.exports = function LaravelGenerator(args, options) {
// var ResponseGenerator = yeoman.generators.Base.extend({	
// 	var that = this;
// 	yeoman.generators.Base.apply(this, arguments);

// 	console.log(chalk.red('You\'re using the fantastic LARAVEL generator.')); 
// 	console.log(chalk.red('Response:  Scaffold your LARAVEL project.'));	
// };

// util.inherits(LaravelGenerator, yeoman.generators.NamedBase);