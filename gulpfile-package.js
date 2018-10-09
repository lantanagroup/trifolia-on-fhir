var gulp                = require('gulp');
var clean               = require('gulp-clean');
var filter              = require('gulp-filter');
var zip                 = require('gulp-zip');
var merge               = require('merge-stream');

const allFiles = [
    'server.js',
    '*Helper.js',
    'package.json',
    'import/**',
    'export/**',
    'controllers/**',
    'config/default.json',
    'config/log4js.json',
    'ig-publisher-template/**',
    'ig-publisher/**',
    '!ig-publisher/latest/**',
    'src/assets/**',
    'src/assets/**',
    'wwwroot/**'];

gulp.task('zip-server-files', () => {
     gulp.src(allFiles, { base: './' })
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'zip-server-files' ]);