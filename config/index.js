'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var rimraf = require('rimraf');
var mysql      = require('mysql');

var Logger = require('../util/logger');
var Settings = require('../util/constants');

var ConfigGenerator = yeoman.generators.Base.extend({
	init: function (args, options) {
		// Setup the logger
		this.logger = new Logger({
			level: this.options.log
		});

		// Setup the Global settings
		this.settings = Settings.getInstance();

		this.on('end', function () {

		});
	},

	config: function () {
		// Default config file name
		this.filename = '.response';

		// Load files
		this.global = this._load(path.join(process.env.HOME  || process.env.USERPROFILE, this.filename)) || {};
		this.local = this._load() || {};

		if (  this.global = this._load(path.join(process.env.HOME  || process.env.USERPROFILE, this.filename))  ){
			// set them to conf
			this.settings.set( this.global );
		}else{
			this.global = {};
			this._ask();
		}
	},

	_load: function (filepath) {
		filepath = filepath || this.filename;
		if (fs.existsSync(filepath)) {
			var content = fs.readFileSync(filepath, {encoding: 'utf8'});
			return JSON.parse(content);
		}
		return null;
	},

	_ask: function(){
		var done = this.async();

		this.logger.warn("I notice you don't have any of your defaults saved...");
		var prompts = [
			{
				type: "confirm",
				name: "createGlobals",
				message: "Would you like to create a new config file?",
				default: true
			}
		];

		this.prompt(prompts, function (props) {
			if (props.createGlobals){
				this._set(done);
			}else{
				done();
			}

		}.bind(this));
	},

	_set: function (cb) {
		var me = this;

		me.logger.alert('OK, lets figure out a few of your local settings...');
		me.logger.alert('This way, we ont have to ask you over and over again in the future.', {seperate: true});


		me.prompt(require('./prompts')(me.options.advanced), function (inputs) {
			me._save(path.join(process.env.HOME, me.filename), inputs)
			cb();
		}.bind(this));
	},

	_save: function(filepath, data) {
		// if i ever need to fall back to locals...
		// filepath = filepath || this.filename;
		// data = data || this.get();
		fs.writeFileSync(filepath, JSON.stringify(data, null, '\t'));
		this.settings.set(data);
		console.log(this.settings.get());
		this.logger.alert('All of your configs have been saved in a .response file for future use!', {seperate: true});
	}


});

module.exports = ConfigGenerator;
