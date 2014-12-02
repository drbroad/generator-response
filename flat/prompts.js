'use strict';

module.exports = function(advanced, defaults) {

	// Validate required
	var requiredValidate = function (value) {
		if (value === '') {
			return 'This field is required.';
		}
		return true;
	};

	var alphaValidate = function (value) {
		var regexp = /^[a-zA-Z0-9-_\s]+$/;
		if (value.search(regexp) == -1){ 
			return 'Only A-Z 0-9 plus dashes and underscores allowed.'; 
		}

		return true;
	}

	// When advanced
	var advancedWhen = function () {
		return advanced;
	};

	return [
		{
			name: "author",
			message: "What is the authors (your) name?",
			default: defaults.author || 'Marc Broad'
		},
		{
			name: "authorEmail",
			message: "What is your email?",
			default: defaults.authorEmail || 'mbroad@thepowertoprovoke.com'
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
