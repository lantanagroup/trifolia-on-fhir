var gulp                = require('gulp');
var clean               = require('gulp-clean');
var filter              = require('gulp-filter');
var exec                = require('child_process').exec;
var zip                 = require('gulp-zip');

gulp.task('dist clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('build wwwroot', function (cb) {
    exec('ng build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('dist wwwroot', ['dist clean', 'build wwwroot'], function() {
    return gulp.src('wwwroot/**')
        .pipe(gulp.dest('dist/wwwroot/'));
});

gulp.task('dist controllers', ['dist clean'], function() {
    return gulp.src('controllers/**')
        .pipe(gulp.dest('dist/controllers/'));
});

gulp.task('dist ig publisher template', ['dist clean'], function() {
    return gulp.src('ig-publisher-template/**')
        .pipe(gulp.dest('dist/ig-publisher-template/'));
});

gulp.task('dist server files', ['dist clean'], function() {
    return gulp.src(['*.js', '*.jar', '!protractor.conf.js', '!gulpfile.js', '!karma.conf.js'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist package json', ['dist clean'], function() {
    return gulp.src('package.json')
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist zip', ['dist wwwroot', 'dist controllers', 'dist ig publisher template', 'dist server files', 'dist package json'], function() {
    gulp.src('dist/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['dist zip']);