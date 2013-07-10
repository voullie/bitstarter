#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var checksFile;

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr) && instr.substring(0, 4) !== 'http') {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
//    return cheerio.load(fs.readFileSync(htmlfile));
	return cheerio.load(htmlfile);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlString, checksfile) {
	
    $ = cheerioHtmlFile(htmlString);

    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var completeCheck = function(htmlString)
{
	var checkJson = checkHtmlFile(htmlString, checksFile);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}

var retrieveFile = function(file)
{
	if (file.substring(0, 4) === 'http')
	{
		var getRemoteFile = function(result, response) {
	        if (result instanceof Error) {
	            console.error('Error: ' + response.message);
	        } else {
	            //console.log(result);
	            completeCheck(result);
	        }
	    };
	    rest.get(file).on('complete', getRemoteFile);
	}
	else
	{
		//means local file
		completeCheck(fs.readFileSync(file));
	}
}

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    checksFile = program.checks;
    retrieveFile(program.file);
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
