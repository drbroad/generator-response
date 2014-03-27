'use strict';
var util 	= require('util');
var path 	= require('path');
var yeoman 	= require('yeoman-generator');
var chalk 	= require('chalk');
var fs      = require('fs');
var rimraf  = require('rimraf');
var q       = require('q');
var _       = require('underscore');
var	spawn  	= require('child_process').spawn;

var CleanGenerator = yeoman.generators.NamedBase.extend({

	init: function(args, options){
		this.on('end', function () {
			console.log(chalk.red('Cleaning End!'));
		});		
	},

	clean: function () {
		var done = this.async();

		var prompts = [{
				name: 'answer',
				type: 'confirm',
				message: chalk.yellow('Are you sure about cleaning and installing in ') + this.name + chalk.yellow('?'),
				default: 'Y'
		}];

		this.prompt(prompts, function (props) {
			if (typeof props === 'undefined') {console.log('See ya'.green);
				return false;
			}

			if (props.answer) {
		  		console.log(chalk.cyan('Start cleaning directory (' + process.cwd() + ')'));

		  		if (!fs.existsSync(process.cwd())) {
					fs.mkdir(process.cwd(), '0755', function () {
					done();
				});
		  	} else {
				var files = fs.readdirSync(process.cwd());
				var self = this;
				var iteratorElement = files.length;

				if (iteratorElement === 0) {
					done();
				}

				var iterator = 0;

				files.forEach(function (item) {
					rimraf(process.cwd() + path.sep + item, function () {
						iterator++;
						console.log(chalk.yellow(item) + chalk.red(' Deleted'));
						if (iterator >= iteratorElement) {
							console.log(chalk.green('Cleaning done'));
							done();
						}
					});
				});
			}
		} else {
				console.log(chalk.green('See ya'));
				return false;
		}
		}.bind(this));
	}

});

module.exports = CleanGenerator;