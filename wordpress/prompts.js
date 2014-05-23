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
			message: 'WordPress URL',
			name: 'url',
			default: (defaults.domainPrefix + '.' + defaults.appName + '.com').toLowerCase() || null,
			validate: requiredValidate,
			filter: function (value) {
				value = value.replace(/\/+$/g, '');
				if (!/^http[s]?:\/\//.test(value)) {
					value = 'http://' + value;
				}
				return value;
			}
		}, {
			message: 'WordPress Version',
			name: 'wpVer',
			default: defaults.wpVer || null,
			validate: requiredValidate,
			when: advancedWhen,
		}, {
			message: 'Site Title',
			name: 'siteTitle',
			validate: alphaValidate,
		}, {
			message: 'Table prefix',
			name: 'tablePrefix',
			default: defaults.tablePrefix || 'wp_',
			validate: requiredValidate
		}, {
			message: 'Database host',
			name: 'dbHost',
			default: defaults.dbHost || 'localhost',
			validate: requiredValidate
		}, {
			message: 'Database name',
			name: 'dbName',
			default: function(session){
				console.log(session);
				return (session.tablePrefix + defaults.appName).split(' ').join('_').toLowerCase();
			},
			validate: requiredValidate
		}, {
			message: 'Database user',
			name: 'dbUser',
			default: defaults.dbUser || null,
			validate: requiredValidate
		}, {
			message: 'Database password',
			name: 'dbPass',
			default: defaults.dbPass || null
		}, {
			message: 'Language',
			name: 'wpLang',
			default: defaults.wplang || null,
			when: advancedWhen,
		}, {
			message: 'Use Git?',
			name: 'git',
			default: defaults.git || 'N',
			type: 'confirm',
			when: advancedWhen,
		}, {
			message: 'Would you like to install WordPress as a submodule?',
			name: 'submodule',
			type: 'confirm',
			default: defaults.submodule || false,
			when: function (res) {
				return !!res.git;
			}
		}, {
			message: 'Would you like to install WordPress with the custom directory structure?',
			name: 'customDirs',
			type: 'confirm',
			default: defaults.customDirs || false,
			when: function (res) {
				return !res.git || !res.submodule;
			}
		}, {
			message: 'WordPress install directory',
			name: 'wpDir',
			default: defaults.wpDir || 'wordpress',
			when: function (res) {
				return !!res.submodule || !!res.customDirs;
			}
		}, {
			message: 'WordPress content directory',
			name: 'contentDir',
			default: defaults.contentDir || 'content',
			validate: requiredValidate,
			when: function (res) {
				return !!res.submodule || !!res.customDirs;
			}
		}, {
			message: 'Create local-config.php?',
			name: 'createLocalConfig',
			type: 'confirm',
			default: defaults.createLocalConfig || false,
			when: advancedWhen
		}, {
			message: 'Block external WP requests?',
			name: 'blockExternalRequests',
			type: 'confirm',
			default: defaults.blockExternalRequests || false,
			when: advancedWhen
		}, {
			message: 'Add wp-config.php to .gitignore?',
			name: 'ignoreWPConfig',
			type: 'confirm',
			default: defaults.ignoreWPConfig || false,
			validate: requiredValidate,
			when: function (res) {
				return (advancedWhen() && !!res.git);
			}
		}, {
			message: 'Add WordPress Core files to .gitignore?',
			name: 'ignoreWPCore',
			type: 'confirm',
			default: defaults.ignoreWPCore || false,
			validate: requiredValidate,
			when: function (res) {
				return (advancedWhen() && !!res.git);
			}
		}, {
			message: 'Use Vagrant?',
			name: 'vagrant',
			type: 'confirm',
			default: defaults.vagrant || false,
			when: advancedWhen,
			validate: requiredValidate
		}, {
			message: 'Install a custom theme?',
			name: 'installTheme',
			type: 'confirm',
			default: (typeof defaults.installTheme !== 'undefined') ? defaults.installTheme : true
		}, {
			message: 'Destination directory',
			name: 'themeDir',
			default: defaults.themeDir || 'response',
			validate: requiredValidate,
			when: function (res) {
				return !!res.installTheme;
			}
		}, {
			message: 'Theme Name',
			name: 'themeName',
			default: defaults.appName,
			validate: requiredValidate,
			when: function (res) {
				return !!res.installTheme;
			}
		}, {			
			message: 'GitHub username',
			name: 'themeUser',
			default: defaults.themeUser || 'roots',
			validate: requiredValidate,
			when: function (res) {
				return !!res.installTheme;
			}
		}, {
			message: 'GitHub repository name',
			name: 'themeRepo',
			default: defaults.themeRepo || 'roots',
			validate: requiredValidate,
			when: function (res) {
				return !!res.installTheme;
			}
		}, {
			message: 'Repository branch',
			name: 'themeBranch',
			default: defaults.themeBranch || 'master',
			validate: requiredValidate,
			when: function (res) {
				return !!res.installTheme;
			}
		}
	];
};
