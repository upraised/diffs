'use strict';
/* gulpfile.js */

require('babel/register');

// Load some modules which are installed through NPM.
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel')
var production = process.env.NODE_ENV === 'production';

var paths = {
  src: 'src/**/*.js',
  test: 'test/**/*.js',
  dist: 'dist/'
};

function handleError(err) {
  console.log('\u0007' + err.toString());
  this.emit('end');
}

gulp.task('lint', function () {
    return gulp.src(paths.src)
        .pipe(eslint())
        .pipe(eslint.format());
        // lint error, return the stream and pipe to failOnError last.
        // .pipe(eslint.failOnError());
});

gulp.task('build', function() {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['lint', 'build'], function () {
    return gulp.src(paths.test, {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test-watch', function() {
  gulp.watch([paths.test, paths.src], ['test']);
});

gulp.task('default', ['test']);
