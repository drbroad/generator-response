'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var rimraf = require('rimraf');
var Logger = require('../util/logger');
var Settings = require('../util/constants');

var CleanGenerator = yeoman.generators.Base.extend({
	init: function (args, options) {
		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();
		console.log(this.settings.get());

		this.on('end', function () {
			
		});
	},

	clean: function () {
		var done = this.async();
		var self = this;

		var prompts = [
			{
				name: 'answer',
				type: 'confirm',
				message: chalk.yellow('Are you sure about cleaning and installing the current directory?'),
				default: 'Y'
			}
		];

		this.prompt(prompts, function (props) {

			if (typeof props === 'undefined') {console.log('See ya'.green);
				return false;
			}

			if (props.answer) {
				self.logger.warn('Cleaning has begun...');
				if (!fs.existsSync(process.cwd())) {
					fs.mkdir(process.cwd(), '0755', function () {
						done();
					});
				} else {
					var files = fs.readdirSync(process.cwd());
					var iteratorElement = files.length;

					if (iteratorElement === 0) {
						self.logger.warn('No Files to remove...');
						done();
					}

					var iterator = 0;
					files.forEach(function (item) {
						rimraf(process.cwd() + path.sep + item, function () {
							iterator++;
							self.logger.warn(item + ' Deleted!');
							if (iterator >= iteratorElement) {
								self.logger.warn('Cleaning has finished!');
								done();
							}
						});
					});
				}
			} else {
				this.logger.warn('Exiting without cleaning the install directory');
				this.logger.error('This may cause some overwriting issues!');
				done();
			}
		}.bind(this));
	}

});

module.exports = CleanGenerator;
