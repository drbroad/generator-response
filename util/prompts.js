'use strict';
var Settings = require('../util/constants');

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

	// Setup the Global settings
	this.settings = Settings.getInstance();

	return [
		{			
			name: 'jobNum',
			message: 'Project Job Number:',
			default: null,
			validate: requiredValidate,
			when: advancedWhen,
		},
		{
			name: 'clientName',
			message: 'Who is the client for this project?',
			default: 'Playground',
			validate: requiredValidate
		},
		{
			name: 'appName',
			message: 'What is the name of this project?',
			default: 'Playground',
			validate: requiredValidate
		},
		{
			type: "checkbox",
			name: "libs",
			message: "What libraries would you like to use?",
			choices: [
						{
							name: "Angular.js",
							value: "js-angular"
						},{
							name: "jQuery",
							value: "js-angular"
						},{
							name: "holder.js",
							value: "js-angular"
						},{
							name: "require.js",
							value: "js-angular"
						}
					]
		}
	];
};
