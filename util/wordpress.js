var https = require('https');
var http = require('http');
var fs = require('fs');
var util = require('util');
var path = require('path');
var mysql = require('mysql');
var chalk = require('chalk');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var wordpressRepo = 'git://github.com/WordPress/WordPress.git';

function getLanguage(contentDir, language, callback) {
	var files = {
		'': '%s.mo',
		'admin': 'admin-%s.mo',
		'admin/network': 'admin-network-%s.mo',
		'twentyeleven': path.join('themes', 'twentyeleven-%s.mo'),
		'twentytwelve': path.join('themes', 'twentytwelve-%s.mo'),
		'twentythirteen': path.join('themes', 'twentythirteen-%s.mo'),
		'twentyfourteen': path.join('themes', 'twentyfourteen-%s.mo'),
	};

	var requested = complete = 0, errors = [];
	for (var file in files) {
		requested++;
		downloadLanguageFile(language, file, 'mo', function(err, res) {
			if (err) {
				return errors.push(err);
			}

			// Pipe to  file
			var p = path.join(contentDir, 'languages', util.format(files[file], language));
			var f = fs.createWriteStream(p);
			res.pipe(f);

			// Complete
			res.on('end', function() {
				complete++;
				if (requested == complete) callback(errors.length ? null : errors);
			});
		});
	}

};

function downloadLanguageFile(language, file, format, callback) {
	// Build url with or without a file
	if (file && file != '') {
		var url = util.format('/projects/wp/dev/%s/%s/default/export-translations?format=%s', file, language, format);
	} else {
		var url = util.format('/projects/wp/dev/%s/default/export-translations?format=%s', language, format);
	}

	// Make request
	http.get({
		hostname: 'translate.wordpress.org',
		path: url,
	}, function(res) {
		// Not found
		if (res.statusCode == 404) {
			// Retry with the language code with no region specifier
			if (language.indexOf('_') !== -1) {
				// es_ES => es
				language = language.split('_')[0];
				return downloadLanguageFile(language, file, format, callback);
			}
			// Not found
			return callback(res);
		}

		// Success
		callback(null, res);
	}).on('error', callback);
};

function getSaltKeys(callback) {
	var ee = new EventEmitter(),
		keys = '';
	https.get("https://api.wordpress.org/secret-key/1.1/salt/", function(res) {
		res.on('data', function(d) {
			keys += d.toString();
		}).on('end', function() {
			ee.emit('end', keys);
		});
	});
	if (typeof callback === 'function') {
		ee.on('end', callback);
	}
	return ee;
};

function getCurrentVersion(callback) {
	var latestVersion = '3.9';
	require('simple-git')().listRemote('--tags '+ wordpressRepo, function(err, tagsList) {
		if (err) return callback(err, latestVersion);
		tagList = ('' + tagsList).split('\n');
		tagList.pop();
		lastTag = /\d\.\d(\.\d)?/ig.exec(tagList.pop());
		if (lastTag !== null) {
			latestVersion = lastTag[0];
		}
		callback(null, latestVersion);
	});
};

function loadConfig() {
	var ee = new EventEmitter();

	function readConfig(path) {
		fs.readFile(path, {encoding:'utf8'}, function(err, contents) {
			if (err) return ee.emit('error', err);
			ee.emit('done', contents);
		});
	}

	fs.exists('wp-config.php', function(exists) {
		if (exists) {
			readConfig('wp-config.php');
		} else {
			fs.exists('../wp-config.php', function(exists) {
				if (exists) {
					readConfig('../wp-config.php');
				} else {
					ee.emit('error', 'Config file does not exist.');
				}
			});
		}
	});

	return ee;
};

function getDbCredentials() {
	var ee = new EventEmitter();

	loadConfig().on('done', function(contents) {
		var db    = {};
		db.name   = contents.match(/define\(["']DB_NAME["'],[\s]*["'](.*)["']\)/)[1];
		db.user   = contents.match(/define\(["']DB_USER["'],[\s]*["'](.*)["']\)/)[1];
		db.pass   = contents.match(/define\(["']DB_PASSWORD["'],[\s]*["'](.*)["']\)/)[1];
		db.host   = contents.match(/define\(["']DB_HOST["'],[\s]*["'](.*)["']\)/)[1];
		db.prefix = contents.match(/\$table_prefix[\s]*=[\s]*["'](.*)["']/)[1];

		ee.emit('done', db);
	}).on('error', function(err) {
		ee.emit('error', err);
	});

	return ee;
};

function createDBifNotExists(db, callback) {
	var ee = new EventEmitter();
	var connection = mysql.createConnection({
		host     : db.dbHost,
		user     : db.dbUser,
		password : db.dbPass,
		socketPath: db.socketPath
	});
	connection.connect(function(err) {
		if (err) return ee.emit('error', err);

		connection.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(db.dbName), function(err, rows, fields) {
			if (err) return ee.emit('error', err);
			connection.end(function() {
				ee.emit('done');
			});
		});

	});

	if (typeof callback === 'function') {
		ee.on('done', callback);
	}

	return ee;
};


/*
install wordpress
 */
function installDB(generator, config, done){
	var ee = new EventEmitter();
    var query ='weblog_title=' + config.siteTitle + '&user_name=' + 'response'  + '&admin_password=' + 'response' + '&admin_password2=' + 'response' + '&admin_email=' + config.authorEmail + ' ';
    var url = config.url + '/' + config.wpDir + '/wp-admin/install.php?step=2';
	var curl = spawn('curl', ['-d', query, '-s', '-o', 'output.txt', url]);

	curl.stdout.on('data', function (data) {
		console.log(chalk.green('curl: ') + (data.toString().replace(/\n/g, '')));
	});

	curl.stderr.on('data', function (data) {
		console.log(chalk.red('DB error ') + data, true);
		// curl doesn't exist
	});

	curl.stderr.on('close', function (code) {
		if (!code) {
			console.log(chalk.green('DB installed '));
			ee.emit('done');
		} else {
			console.log(chalk.red('DB error ') + code);
		}
	});

	if (typeof done === 'function') {
		ee.on('done', done);
	}

	return ee;
};

function getContentDir() {
	var ee = new EventEmitter();

	function checkSimpleContentLocations() {
		fs.exists('wp-content', function(exists) {
			if (exists) {
				fs.realpath('wp-content', function(err, p) {
					if (err) return ee.emit('error', err);
					ee.emit('done', path.relative('.', p));
				});
			} else {
				fs.exists('content', function(exists) {
					if (exists) {
						fs.realpath('content', function(err, p) {
							if (err) erroree.emit('error', err);
							ee.emit('done', path.relative('.', p));
						});
					} else {
						ee.emit('error', 'Cannot determine content directory.');
					}
				});
			}
		});
	}

	loadConfig().on('done', function(contents) {
		var matches = contents.match(/define\(["']WP_CONTENT_DIR["'],[\s]*(.*)\)/);
		if (matches && matches[1]) {

			exec('php -r "echo ' + matches[1] + ';"', function(err, stdout) {
				if (err) return checkSimpleContentLocations();

				fs.exists(stdout, function(exists) {
					if (exists) {
						ee.emit('done', path.relative('.', stdout));
					} else {
						checkSimpleContentLocations();
					}
				});
			});

		} else {
			checkSimpleContentLocations();
		}
	}).on('error', function(err) {
		checkSimpleContentLocations();
	});

	return ee;
};


// git only!!!
function installTheme(generator, config, done) {
	generator.remote(config.themeUser, config.themeRepo, config.themeBranch, function(err, remote) {
		remote.directory('.', path.join(config.contentDir, 'themes', config.themeDir));
		done();
	});
};

function setupTheme(generator, config, done) {

	console.log(chalk.green('Setting Up Theme'));

	var themePath = path.join(config.contentDir, 'themes', config.themeDir),
		themePackageJson = path.join(themePath, 'package.json');

	if (fs.existsSync(themePackageJson)) {
		var oldDir = process.cwd();
		process.chdir(themePath);
		exec('npm install', function(err) {
			if (fs.existsSync('Gruntfile.js')) {
				exec('grunt setup', function(err) {
					console.log(chalk.green('Theme setup!'));
					process.chdir(oldDir);
					done();
				});
			} else {
				console.log(chalk.red('Gruntfile.js missing!'));
				process.chdir(oldDir);
				done();
			}
		});
	} else {
		console.log(chalk.red('package.json missing!'));
		done();
	}

};

function activateTheme(db, callback) {
	var ee = new EventEmitter();

		var connection = mysql.createConnection({
			host     : db.dbHhost,
			user     : db.dbUser,
			password : db.dbPass,
			database : db.dbName,
			socketPath: db.socketPath
		});


		connection.connect(function(err) {
			if (err) return ee.emit('error', err);

			var q = [
				"UPDATE " + db.tablePrefix + "options",
				"SET option_value =  "+ mysql.escape(db.themeDir),
				"WHERE option_name = 'template'",
				"OR option_name = 'stylesheet'"
			].join('\n');

			connection.query(q, function(err, rows, fields) {
				if (err) return ee.emit('error', err);
				connection.end(function() {
					ee.emit('done');
				});
			});

		});

	if (typeof callback === 'function') {
		ee.on('done', callback);
	}

	return ee;
};

module.exports = {
	repo : wordpressRepo,
	getSaltKeys : getSaltKeys,
	getCurrentVersion : getCurrentVersion,
	getDbCredentials : getDbCredentials,
	createDBifNotExists : createDBifNotExists,
	loadConfig : loadConfig,
	getContentDir : getContentDir,
	installTheme : installTheme,
	installDB : installDB,
	setupTheme : setupTheme,
	activateTheme : activateTheme,
	downloadLanguageFile: downloadLanguageFile,
	getLanguage: getLanguage,
};
