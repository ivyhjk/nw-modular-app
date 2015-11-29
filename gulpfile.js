'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

var dir = {
	js : [
		'./src/*.js', // Source level.
		'./src/**/**/*.js', // Modules level.
		'./src/**/**/**/*.js' // Modules folder (controllers, views, etc) level.
	],
	css : [

	]
};

var destination = {
	folder : 'assets',
	file : 'all.js'
};

// JS minifying task
gulp.task('uglify', function () {
	return gulp
		.src(dir.js)
		// .pipe(uglify())
		.pipe(concat(destination.file))
		.pipe(gulp.dest(destination.folder));
});

gulp.task('watch', function () {
	livereload.listen();

	gulp.watch(dir.js, ['uglify']).on('change', livereload.changed);
});

gulp.task('default', ['uglify', 'watch']);
