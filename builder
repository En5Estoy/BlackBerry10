#!/usr/bin/env node

/**
* @author Roman A. Sarria
*
* Remember chmod u+x to run directly
*/

var program = require('commander'),
	exec = require('child_process').exec,
	colors = require('colors'),
	fs = require('fs'),
	sqwish = require('sqwish'),
	_ = require('underscore'),
	path = require('path'),
	nfs = require('node-fs');

program.version('0.0.1')
	.option('-o, --options [options]', 'JSON Options file')
	.parse(process.argv);

if ( program.options) {
	var options = JSON.parse( fs.readFileSync( program.options ) );

	var build_path = options.build_path;

	if( !fs.existsSync( build_path ) ) {
		fs.mkdirSync( build_path );
	} else {
		console.error("Delete directory first or files will be overrided".red);
		process.stdin.destroy();
	}

	// CSS
	var css = options.css;

	console.log('[CSS]'.green + ' Compiling...');

	var uncompiled_css = "";
	for( var i in css.files ) {
		uncompiled_css += fs.readFileSync( css.files[i] ) + ' \n\n ';
	}

	var compiled_css = sqwish.minify( uncompiled_css );

	try {
		fs.mkdirSync( build_path + path.sep + path.dirname( css.output ) + path.sep );
	} catch( e ) {}
	fs.writeFileSync( build_path + path.sep + css.output, compiled_css );

	console.log('[CSS]'.green + ' Compiled successfully.');

	console.log('[JS]'.green + ' Compiling...');

	var js = options.js;

	exec('r.js -o ' + js.script, function(error, stdout, stderr) {
		console.info('[JS]'.green + " Code build executed");

		//fs.createReadStream(js.output).pipe( fs.createWriteStream( build_path + '/' + js.output ) );
		//fs.unlinkSync(js.output);

		// Copy all files
		console.log('[FILES]'.green + ' Copy files...');
		var files_to_copy = options.copy;
		var files = _.keys( files_to_copy );
		for( var i in files ) {
			var key = files[i];
			var file = files_to_copy[key];
			if( file.indexOf('/') !== -1 ) {
				try {
					nfs.mkdirSync( build_path + path.sep + path.dirname( file ) + path.sep, 0775, true );
				} catch( e ) {}
			}
			fs.createReadStream( key ).pipe( fs.createWriteStream( build_path + path.sep + file ) );
		}

		console.log('[FILES]'.green + ' Files ready...');

		process.stdin.destroy();
	});
} else {
	program.help();
}