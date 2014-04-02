'use strict';

var Settings = (function () {

	var config = {
		'_TYPE_LARAVEL'	: 'Laravel',
		'_TYPE_FLAT'		: 'HTML/Flatfile',
		'_TYPE_WORDPRESS'	: 'Wordpress',
		'_TYPE_EMAIL'		: 'Email Campaign'
	};

	var opt = {};

	function get(key) {
		// Get a single key
		if (key) {
			if (typeof opt[key] !== 'undefined') {
				return opt[key];
			}
			return;
		}

		// Get all data
		var data = {};
		for (var g in opt)
		{
			data[g] = opt[g];
		}
		return data;
	}

	function set(key, val) {
		if (typeof val !== 'undefined') {
			// Set a single key
			opt[key] = val;
		} else {
			// Set multiple keys
			for (var i in key)
			{
				opt[i] = key[i];
			}
		}
	}

	function getOpt(key) {
		// Get a single key
		if (key) {
			if (typeof config[key] !== 'undefined') {
				return config[key];
			}
			return;
		}

		// Get all data
		var data = {};
		for (var g in config)
		{
			data[g] = config[g];
		}
		return data;
	}

	function setOpt(key)
	{
		var val = getOpt(key);
		set(key, val);
		return val;
	}

	var settings;
	function init()
	{
		return {
			get : get,
			set: set,
			getOpt : getOpt,
			setOpt : setOpt
		};
	}

	return	{
		// Get the Singleton instance if one exists
		// or create one if it doesn't
		getInstance: function () {
			if (!settings)
			{
				settings = init();
			}
			return settings;
		}
	};

})();


module.exports = Settings;