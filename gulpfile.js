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

// html, scss, ts

gulp.task('html', function() {
	gulp.src('src/**/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('scss', function() {
	gulp.src('src/scss/**/*.scss')
	.pipe(sass())
	.pipe(concat('styles.css'))
	.pipe(gulp.dest('dist'));
});

gulp.task('ts', function() {
	browserify('src/ts/main.ts')
	.plugin(tsify, {target: 'es2015'})
	.transform(babelify, {presets: 'es2015', extensions: '.ts'})
	.bundle()
	.on('error', function(err) { console.error(err.toString()); })
	.pipe(fs.createWriteStream("dist/bundle.js"));
});

// build and clean

gulp.task('build', ['html', 'scss', 'ts']);

gulp.task('clean', function() {
	gulp.src(['dist/**/*.html', 'dist/styles.css', 'dist/bundle.js'], {
		read: false
	})
	.pipe(clean());
});

// serve

gulp.task('serve', function() {
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch('src/ts/**/*.ts', ['ts']);
	connect.server({
		root: 'dist',
	});
});
