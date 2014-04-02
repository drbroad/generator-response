'use strict';
var chalk = require('chalk');

// Rainbow display
var rainbowColors = [
	chalk.red,
	chalk.yellow,
	chalk.green,
	chalk.blue,
	chalk.magenta
];
chalk.rainbow = function(str) {
	var arStr = str.split(''),
		out = '';
	for (var i in arStr) {
		if (arStr[i] == ' ' || arStr[i] == '\t' || arStr[i] == '\n')
			out += arStr[i];
		else
			out += rainbowColors[i % rainbowColors.length](arStr[i]);
	}
	return out;
};

module.exports = {
	wp : [
		'',
		chalk.bold.red('                     YeoPress'),
		'',
		chalk.grey('                 ..::::::::::::..'),
		chalk.grey('             .:::   ')  + chalk.cyan('::::::::::')                          + chalk.grey('   ::..'),
		chalk.grey('           .:    ')     + chalk.cyan(':::::::::::::::')                     + chalk.grey('    :..'),
		chalk.grey('         .:   ')        + chalk.cyan(':::::::::::::::::::::')               + chalk.grey('   :.'),
		chalk.grey('        .:  ')          + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('     :..'),
		chalk.grey('       .:  ')           + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('       ::.'),
		chalk.grey('      .:         ')     + chalk.cyan(':::          :::')                    + chalk.grey('        :..'),
		chalk.grey('     .:       ')        + chalk.cyan('::::::::     :::::::')                + chalk.grey('        :.'),
		chalk.grey('     :  ')              + chalk.cyan(':      :::::::      :::::::     :')   + chalk.grey('  :.'),
		chalk.grey('    .:  ')              + chalk.cyan('::     ::::::::     :::::::    ::')   + chalk.grey('  :.'),
		chalk.grey('    :: ')               + chalk.cyan('::::     :::::::      :::::::   :::') + chalk.grey(' ::'),
		chalk.grey('    :: ')               + chalk.cyan('::::     ::::::::     :::::::   :::') + chalk.grey(' ::'),
		chalk.grey('    :: ')               + chalk.cyan(':::::     :::::::      ::::::  ::::') + chalk.grey(' ::'),
		chalk.grey('    :: ')               + chalk.cyan(':::::     ::::::       ::::::  ::::') + chalk.grey(' :.'),
		chalk.grey('    .:  ')              + chalk.cyan(':::::     :::::  ::    ::::  ::::')   + chalk.grey('  :.'),
		chalk.grey('     :  ')              + chalk.cyan('::::::     :::   ::    ::::  ::::')   + chalk.grey('  :.'),
		chalk.grey('     .:  ')             + chalk.cyan(':::::     ::   :::     ::  ::::')     + chalk.grey('  :.'),
		chalk.grey('      .:  ')            + chalk.cyan(':::::        :::::    ::  :::')       + chalk.grey('  ::.'),
		chalk.grey('      .::  ')           + chalk.cyan('::::       ::::::       :::')         + chalk.grey('  ::.'),
		chalk.grey('        .:  ')          + chalk.cyan('::::     ::::::::     :::')           + chalk.grey('  ::.'),
		chalk.grey('         .:   ')        + chalk.cyan('::    :::::::::    ::')               + chalk.grey('   :.'),
		chalk.grey('          .::      ')   + chalk.cyan('::::::::::')                          + chalk.grey('      ::.'),
		chalk.grey('            ..::    ') + chalk.cyan('::::::::')                             + chalk.grey('    ::..'),
		chalk.grey('               ..:::..     ..:::..'),
		chalk.grey('                    ..:::::.. '),
		'',
		chalk.red('          A Yeoman Generator For WordPress'),
		''
	].join('\n'),
	go : chalk.rainbow([
		'  ',
		'   __   __  _______  ______    _______      _     _  _______      _______  _______    __ ',
		'  |  | |  ||       ||    _ |  |       |    | | _ | ||       |    |       ||       |  |  |',
		'  |  |_|  ||    ___||   | ||  |    ___|    | || || ||    ___|    |    ___||   _   |  |  |',
		'  |       ||   |___ |   |_||_ |   |___     |       ||   |___     |   | __ |  | |  |  |  |',
		'  |       ||    ___||    __  ||    ___|    |       ||    ___|    |   ||  ||  |_|  |  |__|',
		'  |   _   ||   |___ |   |  | ||   |___     |   _   ||   |___     |   |_| ||       |   __ ',
		'  |__| |__||_______||___|  |_||_______|    |__| |__||_______|    |_______||_______|  |__|',
		''
	].join('\n')),
	three : chalk.red([
		' _______ __   __ ______   _______ _______ ',
		'|       |  | |  |    _ | |       |       |',
		'|_     _|  |_|  |   | || |    ___|    ___|',
		'  |   | |       |   |_||_|   |___|   |___ ',
		'  |   | |       |    __  |    ___|    ___|',
		'  |   | |   _   |   |  | |   |___|   |___ ',
		'  |___| |__| |__|___|  |_|_______|_______|'
	].join('\n')),
	two : chalk.magenta([
		' _______ _     _ _______ ',
		'|       | | _ | |       |',
		'|_     _| || || |   _   |',
		'  |   | |       |  | |  |',
		'  |   | |       |  |_|  |',
		'  |   | |   _   |       |',
		'  |___| |__| |__|_______|'
	].join('\n')),
	one : chalk.cyan([
		' _______ __    _ _______ ',
		'|       |  |  | |       |',
		'|   _   |   |_| |    ___|',
		'|  | |  |       |   |___ ',
		'|  |_|  |  _    |    ___|',
		'|       | | |   |   |___ ',
		'|_______|_|  |__|_______|'
	].join('\n')),
	wawa : chalk.red([
		'',
		'____    __    ____  ___   ____    __    ____  ___       __   __ ',
		'\\   \\  /  \\  /   / /   \\  \\   \\  /  \\  /   / /   \\     |  | |  |',
		' \\   \\/    \\/   / /  ^  \\  \\   \\/    \\/   / /  ^  \\    |  | |  |',
		'  \\            / /  /_\\  \\  \\            / /  /_\\  \\   |  | |  |',
		'   \\    /\\    / /  _____  \\  \\    /\\    / /  _____  \\  |__| |__|',
		'    \\__/  \\__/ /__/     \\__\\  \\__/  \\__/ /__/     \\__\\ (__) (__)',
		'',
		'                 Game over....try again.',
		''
	].join('\n'))
};