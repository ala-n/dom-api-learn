// BUILD CONSTANTS
const OUTPUT_DIR = 'publish';
const SCRIPT_OUTPUT = 'main.min.js';
const STYLE_OUTPUT = 'styles.min.css';

// DEPENDENCIES
const gulp = require('gulp'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    sourcemap = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    includeTag = require('gulp-include-tag');

const browserSync = require('browser-sync').create();

// TASKS
gulp.task('default', ['css', 'js', 'build-html']);

gulp.task('clean', function() {
    return gulp.src([
    	OUTPUT_DIR + '/*.html',
    	OUTPUT_DIR + '/*.js',
	    OUTPUT_DIR + '/*.css'
    ], {read: false}).pipe(clean());
});

gulp.task('css', function () {
	gulp.src(['src/*.less'])
		.pipe(less())
		.pipe(concat(STYLE_OUTPUT))
		.pipe(minifyCSS())
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(browserSync.stream());
});

gulp.task('js', function () {
	gulp.src('src/js/*')
		.pipe(concat(SCRIPT_OUTPUT))
		.pipe(uglify())
		.pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('build-html', function () {
	return gulp.src('src/index.html')
		.pipe(includeTag())
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(browserSync.stream());
});

// DEBUG TASKS
gulp.task('js-debug', function () {
    gulp.src('src/js/*')
        .pipe(sourcemap.init())
        .pipe(concat(SCRIPT_OUTPUT))
        .pipe(uglify())
        .pipe(sourcemap.write())
        .pipe(gulp.dest(OUTPUT_DIR))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['css', 'js-debug', 'build-html'], function() {
    browserSync.init({
        server: "./" + OUTPUT_DIR
    });

    gulp.watch("src/js/*.js", ['js']);
	gulp.watch("src/css/*.less", ['css']);
    gulp.watch("src/**/*.html", ['build-html']);
});