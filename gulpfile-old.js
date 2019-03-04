"use strict";
const syntax        = 'scss';

const gulp          = require('gulp');
const sass          = require('gulp-sass');
const	browserSync   = require('browser-sync');
const	concat        = require('gulp-concat');
const del			  = require("del");
const	uglify        = require('gulp-uglify');
const	cleancss      = require('gulp-clean-css');
const	rename        = require('gulp-rename');
const	autoprefixer  = require('gulp-autoprefixer');
const	notify        = require('gulp-notify');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false,
		// tunnel: true, tunnel: "demorgan-demo",
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'))
});

gulp.task('build', function() {
	return gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
})

function removeDist() {
	return del(["./dist"]);
}

gulp.task('default', gulp.parallel('watch', 'browser-sync'));

