'use strict';
var util 	= require('util');
var path 	= require('path');
var yeoman 	= require('yeoman-generator');
var chalk 	= require('chalk');
var	spawn  	= require('child_process').spawn,

var LaravelGenerator = yeoman.generators.NamedBase.extend({

	init: function(args, options, callback){

		console.log('You called the post subgenerator with the argument ' + this.name + '.');

		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));		
		this.on('end', function () {
			this.options.callback();
		});		
	},

	askFor: function () {
		var done = this.async();
		var prompts = [
			{
				name: "bowerDir",
				message: "What directory would you like bower to install components to?",
				default: "vendor"
			},
		];

		this.prompt(prompts, function (props) {
		 	done();
		}.bind(this));
	},

	app: function () {

	},

	projectfiles: function () {

	},

	runtime: function (){

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