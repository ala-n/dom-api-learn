var gulp = require('gulp'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    sourcemap = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    includeTag = require('gulp-include-tag');

var browserSync = require('browser-sync').create();

gulp.task('clean', function() {
    return gulp.src(['dist'], {read: false}).pipe(clean());
});

gulp.task('css', function () {
	gulp.src(['src/css/*.css','src/css/*.less'])
		.pipe(less())
		.pipe(concat('styles.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src('src/js/*')
        .pipe(sourcemap.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemap.write())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});
gulp.task('js-prod', function () {
    gulp.src('src/js/*')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('img', function () {
    gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('build-html', function () {
    return gulp.src('src/index.html')
        .pipe(includeTag())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['css', 'js', 'build-html'], function() {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/css/*.css", ['css']);
	gulp.watch("src/css/*.less", ['css']);
    gulp.watch("src/**/*.html", ['build-html']);
});

gulp.task('default', ['css', 'js-prod', 'img', 'build-html']);