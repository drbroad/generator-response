'use strict';
var util = require('util');
var chalk = require('chalk');

// Utility extend
function extend(obj) {
	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, len = args.length; i < len; i++) {
		if (args[i]) {
			for (var prop in args[i]) {
				obj[prop] = args[i][prop];
			}
		}
	}
	return obj;
}

// The supported severity levels
var severityLevels = ['verbose', 'log', 'warn', 'error', 'alert'];

var Logger = function (options) {
	if (!(this instanceof Logger)) {
		return new Logger(options);
	}
	this.options = extend({}, Logger.defaultOptions, options);
};

Logger.defaultOptions = {
	seperate            : false,
	level               : 'error',
	verbosePrefix       : '** ',
	verbosePrefixTheme  : chalk.yellow.bold,
	verboseMessageTheme : chalk.white,
	verboseStream       : process.stdout,
	logPrefix           : '>> ',
	logPrefixTheme      : chalk.cyan.bold,
	logMessageTheme     : chalk.white,
	logStream           : process.stdout,
	warnPrefix          : '!! ',
	warnPrefixTheme     : chalk.white.bold,
	warnMessageTheme    : chalk.magenta,
	warnStream          : process.stdout,
	errorPrefix         : 'Error: ',
	errorPrefixTheme    : chalk.red.bold,
	errorMessageTheme   : chalk.red,
	errorStream         : process.stderr,
	alertPrefix         : '[>]',
	alertPrefixTheme    : chalk.green.bold,
	alertMessageTheme   : chalk.green,
	alertStream         : process.stderr
};

severityLevels.forEach(function (fnc) {
	Logger.prototype[fnc] = function (out, opts) {
		if (severityLevels.indexOf(fnc) >= severityLevels.indexOf(this.options.level)) {
			opts = extend({}, this.options, opts);
			var prefix = opts[fnc + 'PrefixTheme'](opts[fnc + 'Prefix']);

			var message;
			if (typeof out === 'object') {
				message = opts[fnc + 'MessageTheme'](util.inspect(out));
			} else {
				message = opts[fnc + 'MessageTheme'](out + '');
			}

			if (typeof opts[fnc + 'Stream'] === 'function') {
				opts[fnc + 'Stream'].write(prefix + message);
			} else if (typeof console[fnc] === 'function') {
				console[fnc](prefix + message);
			} else {
				console.log(prefix + message);
			}

			if (opts.seperate) {
				console.log(chalk.cyan('-------------------------------------------'));
			}
		}
	};
});

module.exports = Logger;