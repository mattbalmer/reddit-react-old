var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    nib = require('nib');

var paths = {
    source: {
        css: [ 'client/css/**/*.styl', '!client/css/_/**/*.styl' ],
        js: 'client/js/**/*.js',
        app_js: './client/js/app.js',
        html: [ 'client/**/*.jade' ]
    },
    dest: {
        css: 'public/css/',
        js: 'public/js/',
        html: 'public/'
    }
};

// === Tier 1 Tasks ===
gulp.task('html', function() {
    return gulp.src(paths.source.html)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(paths.dest.html));
});
gulp.task('css', function() {
    return gulp.src(paths.source.css)
        .pipe(stylus({
            use: nib(),
            paths: [ '_' ],
            import: [ 'nib', '_' ]
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.dest.css));
});
gulp.task('js', function() {
    return browserify(paths.source.app_js)
        .transform(reactify)
        .bundle()
        .pipe(source('reddit.js'))
        .pipe(gulp.dest(paths.dest.js));
});
gulp.task('watch', function() {
    gulp.watch(paths.source.css, ['css']);
    gulp.watch(paths.source.js, ['js']);
    gulp.watch(paths.source.html, ['html']);
});

// === Tier 2 Tasks ===
gulp.task('compile', ['html', 'css', 'js']);
gulp.task('default', ['compile', 'watch']);