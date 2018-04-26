'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

var fs = require("fs");

var babelify = require('babelify');
var browserify = require('browserify');

// scss and js

gulp.task('scss', function() {
	gulp.src('scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('build'));
});

gulp.task('js', function() {
	browserify('js/main.js', {debug: true})
	.transform(babelify, {presets: 'env'})
	.bundle()
	.on('error', function(err) { console.error(err.toString()); })
	.pipe(fs.createWriteStream("build/main.js"));
});

// build and clean

gulp.task('build', ['scss', 'js']);

gulp.task('clean', function() {
	gulp.src(['build/**/*.css', 'build/bundle.js'], {
		read: false
	})
	.pipe(clean());
});

// serve

gulp.task('serve', function() {
	gulp.watch('scss/**/*.scss', ['scss']);
	gulp.watch('js/**/*.js', ['js']);
	connect.server({
		root: '.',
	});
});