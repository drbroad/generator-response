'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _TYPE_LARAVEL 	= 'Laravel';
var _TYPE_FLAT		= 'HTML Flatfile';	

var ResponseGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
		console.log(chalk.yellow('MAIN APP INIT...'));
		
		this.on('end', function () {
			console.log(chalk.yellow('MAIN APP END...'));

			this.installDependencies({
				bower: true,
				npm: true,
				skipInstall: false,
				callback: function () {
					console.log(chalk.green ( 'Everything is ready! Running grunt build...') );
					this.emit('dependenciesInstalled');
				}.bind(this)
			});
		});

		// Now you can bind to the dependencies installed event
		this.on('dependenciesInstalled', function() {
			this.spawnCommand('grunt');
		});			
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		//console.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		// replace it with a short and sweet description of your generator
		console.log(chalk.cyan('You\'re using the fantastic RespLaravel generator.')); 
		console.log(chalk.magenta('Response:  Scaffold your latest project.'));

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
							}
						] 
			},	
			{
				type: "checkbox",
				name: "libs",
				message: "What libraries would you like to use?",
				choices: [	
							{
								name: "Angular.js",
								value: _TYPE_FLAT
							},{
								name: "jQuery",	
								value: _TYPE_LARAVEL
							},{
								name: "holder.js",	
								value: _TYPE_LARAVEL								
							},{
								name: "require.js",	
								value: _TYPE_LARAVEL								
							}
						] 
			},				
			{
				name: "webDir",
				message: "What would you like to name the www dir (www, public, httpdocs etc...)?",
				when: function(props){
					return props.generatorType === _TYPE_FLAT;
				}
			},				
			{
				name: "appName",
				message: "What would you like to call this project?",
				default: "Playground"
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
			console.log(chalk.yellow('PUSHING PROPS...'));

			this.options = props

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

	app: function () {
		var done = this.async();

		console.log('generator: ', this.generatorType);

		if ( this.generatorType === _TYPE_LARAVEL) {
			// Here: we'are calling the nested generator (via 'invoke' with options)
			this.invoke("response:laravel", {args:[this.appName], options: this.options});
			console.log(chalk.yellow('CONTINUE WITH MAIN APP...'));
		}

		// this.mkdir('www');
		// this.mkdir('www/assets');
		// this.mkdir('www/assets/js');
		// this.mkdir('www/assets/scripts/plugins');

		// this.mkdir('www/assets/scripts');
		// this.mkdir('www/assets/css');
		// this.mkdir('www/assets/img');
		// this.mkdir('www/assets/less');
		// this.mkdir('www/assets/less/partials');
		// this.mkdir('www/assets/fonts');

		// this.template('_index.md', 'index.md');
		// this.template('_gruntfile.js', 'Gruntfile.js');
		// this.template('_index.html', 'www/index.html');
		// this.template('assets/less/app.less', 'www/assets/less/app.less');
		// this.copy('assets/less/partials/variables.less', 'www/assets/less/partials/variables.less');
		// this.copy('assets/js/main.js', 'www/assets/scripts/main.js');
		// this.template('_bowerrc', '.bowerrc');
		// this.template('_bower.json', 'bower.json');
		// this.template('_package.json', 'package.json');

	},

	projectfiles: function () {
		console.log(chalk.yellow('MAIN PROJECT FILES...'));
		//this.copy('editorconfig', '.editorconfig');
		//this.copy('jshintrc', '.jshintrc');
	},

	runtime: function (){
		console.log(chalk.yellow('MAIN RUNTIME...'));
		//this.copy('gitignore', '.gitignore');
	}


});

module.exports = ResponseGenerator;
