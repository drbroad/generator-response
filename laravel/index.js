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
				name: "bowerDir",
				message: "What directory would you like bower to install components to?",
				default: "vendor"
			},
		];

		this.prompt(prompts, function (props) {
		 	done();
		}.bind(this));
	},

Clean: function () {
  var cb = this.async();

  var prompts = [{
    name: 'answear',
    type: 'confirm',
    message: chalk.yellow('Are you sure about cleaning and installing in ') + this.name + chalk.yellow('?'),
    default: 'Y'
  }];

  this.prompt(prompts, function (props) {
    if (typeof props === 'undefined') {console.log('See ya'.green);
      return false;
    }

    if (props.answear) {
      console.log(chalk.cyan('Start cleaning directory (' + process.cwd() + ')'));

      if (!fs.existsSync(process.cwd())) {
        fs.mkdir(process.cwd(), '0755', function () {
          cb();
        });
      } else {
        var files = fs.readdirSync(process.cwd());
        var self = this;
        var iteratorElement = files.length;

        if (iteratorElement === 0) {
          cb();
        }

        var iterator = 0;

        files.forEach(function (item) {
          rimraf(process.cwd() + path.sep + item, function () {
            iterator++;
            console.log(chalk.yellow(item) + chalk.red(' Deleted'));
            if (iterator >= iteratorElement) {
              console.log(chalk.green('Cleaning done'));
              cb();
            }
          });
        });
      }
    } else {
      console.log(chalk.green('See ya'));
      return false;
    }
  }.bind(this));
},	

	checkComposer: function () {
	  var done = this.async();

	  console.log(chalk.cyan('Check composer install'));
	  var composer = spawn('composer'),
	      self     = this;

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