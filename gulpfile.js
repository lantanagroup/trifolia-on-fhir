var gulp                = require('gulp');
var zip                 = require('gulp-zip');
var es                  = require('event-stream');
var through             = require('through2');
var path                = require('path');
var fs                  = require('fs');

const allFiles = [
    'gulpfile.js',                      // Included so that it can be used to install in the future
    'server.js',                        // Main server starting file
    '*.yaml',                           // REST API documentation
    'package.json',                     // NPM package definition for dependencies and version info
    'config/default.json',              // Default config
    'config/log4js.json',               // Default logging
    'server/**/*.js',                   // All files needed for running the application server
    'ig-publisher-template/**',         // The FHIR IG Publisher template
    'ig-publisher/**',                  // The built-in FHIR IG Publisher
    'src/assets/**',                    // Assets needed for both server and client/UI
    'src/app/**/*.js',                  // Any compiled JS shared between the server and the client
    'wwwroot/**',                       // All compiled files for the client/UI
    '!ig-publisher/latest/**',          // Exclude the latest version of the FHIR IG Publisher from packaging
    '!wwwroot/igs/**',                  // Exclude published implementation guides from dev/test environments
];

function createManifest(cb) {
    const fileNames = [];

    function recordFileName(es) {
        return through.obj(function(chunk, enc, cb) {
            fileNames.push(chunk.path);
            return cb(null, fileNames);
        });
    }

    return gulp.src(allFiles, { base: './' })
        .pipe(recordFileName(es))
        .on('end', function() {
            fs.writeFileSync(path.join(__dirname, './manifest.txt'), fileNames.join('\n'));
            cb();
        });
}

function zipServerFiles() {
    return gulp.src(allFiles.concat(['manifest.txt']), { base: './' })
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
}

function cleanupFromManifest() {

}

exports.package = gulp.series(createManifest, zipServerFiles);
exports.install = cleanupFromManifest;