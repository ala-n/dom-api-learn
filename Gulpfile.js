// BUILD CONSTANTS
const OUTPUT_DIR = 'publish';
const SCRIPT_OUTPUT = 'main.min.js';
const STYLE_OUTPUT = 'styles.min.css';

// DEPENDENCIES
const gulp = require('gulp'),
	gzip = require('gulp-gzip'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
    includeTag = require('gulp-include-tag');

const browserSync = require('browser-sync').create();

function cleanTask() {
	return gulp.src([
		OUTPUT_DIR + '/*.html',
		OUTPUT_DIR + '/*.js',
		OUTPUT_DIR + '/*.css',
		OUTPUT_DIR + '/*.*.gz'
	], {read: false}).pipe(clean());
}

function buildHTML() {
	return gulp.src('src/index.html')
		.pipe(includeTag())
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(browserSync.stream())
		.pipe(gzip())
		.pipe(gulp.dest(OUTPUT_DIR));
}

function buildLess() {
	return gulp.src(['src/*.less'])
		.pipe(less())
		.pipe(concat(STYLE_OUTPUT))
		.pipe(cleanCSS())
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(browserSync.stream())
		.pipe(gzip())
		.pipe(gulp.dest(OUTPUT_DIR));
}

function buildJS() {
	return gulp.src('src/js/*')
		.pipe(concat(SCRIPT_OUTPUT))
		.pipe(uglify())
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(gzip())
		.pipe(gulp.dest(OUTPUT_DIR));
}

// DEBUG TASKS
function debugJS() {
	return gulp.src('src/js/*')
		.pipe(concat(SCRIPT_OUTPUT))
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(browserSync.stream());
}

gulp.task('clean', cleanTask);
gulp.task('build-js', buildJS);
gulp.task('debug-js', debugJS);
gulp.task('build-html', buildHTML);
gulp.task('build-less', buildLess);

const buildTask = gulp.parallel('build-less', 'build-js', 'build-html');
const debugTask = gulp.parallel('build-less', 'debug-js', 'build-html');

gulp.task('build', buildTask);
gulp.task('build-debug', debugTask);

function serveTask() {
	browserSync.init({
		server: './' + OUTPUT_DIR,
		files: ['./' + OUTPUT_DIR]
	});

	gulp.watch('src/js/*.js', gulp.series('debug-js'));
	//gulp.watch('src/less/*.less',  gulp.series('build-less'));
	gulp.watch('src/**/*.html', gulp.series('build-html'));
}
gulp.task('serve', serveTask);

const defaultTask = gulp.series(debugTask, serveTask);

gulp.task('default', defaultTask);