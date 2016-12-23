'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var fs = require("fs");

var sass = require('gulp-sass');
var browserify = require('browserify');
var tsify = require('tsify');
var babelify = require('babelify');

// scss and ts

gulp.task('scss', function() {
	gulp.src('scss/**/*.scss')
	.pipe(sass())
	.pipe(concat('styles.css'))
	.pipe(gulp.dest('dist'));
});

gulp.task('ts', function() {
	browserify('ts/main.ts')
	.plugin(tsify, {target: 'es2015'})
	.transform(babelify, {presets: 'es2015', extensions: '.ts'})
	.bundle()
	.on('error', function(err) { console.error(err.toString()); })
	.pipe(fs.createWriteStream("dist/bundle.js"));
});

// build and clean

gulp.task('build', ['scss', 'ts']);

gulp.task('clean', function() {
	gulp.src(['dist/styles.css', 'dist/bundle.js'], {read: false})
	.pipe(clean());
});

// serve

gulp.task('serve', function() {
	gulp.watch('scss/**/*.scss', ['scss']);
	gulp.watch('ts/**/*.ts', ['ts']);
	connect.server({
		root: 'dist',
	});
});
