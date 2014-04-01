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
		},
		{
			name: "webDir",
			message: "What would you like to name the www dir (www, public, httpdocs etc...)?",
			when: function(props){
				return props.generatorType === _TYPE_FLAT;
			}
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
};
