'use strict';

module.exports = function(advanced, defaults) {

	// Validate required
	var requiredValidate = function (value) {
		if (value === '') {
			return 'This field is required.';
		}
		return true;
	};

	// When advanced
	var advancedWhen = function () {
		return advanced;
	};

	return [
		{
			message: 'What is your local DB host?',
			name: 'dbHost',
			default:  'localhost',
			validate: requiredValidate
		},
		{
			message: 'What is your local DB username?',
			name: 'dbUser',
			default:  'root',
			validate: requiredValidate
		},
		{
			message: 'What is your local DB password',
			name: 'dbPass',
			default: ''
		},
		{
			name: "author",
			message: "What is the authors (your) name?",
			default: "Marc Broad",
			validate: requiredValidate
		},
		{
			name: "authorEmail",
			message: "What is your email?",
			default: "mbroad@thepowertoprovoke.com",
			validate: requiredValidate
		},
		{
			type: 'list',
			name: 'socketPath',
			message: 'Choose your dev machine',
			choices: [
				{
					name: 'OSX',
					value: "/Applications/MAMP/tmp/mysql/mysql.sock"
				},
				{
					name: 'Windows ',
					value: ""
				}

			]
		}
	];
};
