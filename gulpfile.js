var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    through2 = require('through2'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    nib = require('nib');

var paths = {
    source: {
        css: [ 'client/css/**/*.styl', '!client/css/_/**/*.styl' ],
        js: 'client/**/*.js',
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
    return gulp.src(paths.source.app_js)
        .pipe(through2.obj(function(file, enc, next) {
            browserify(file.path, {debug: true})
                .transform(babelify)
                .bundle(function(err, res) {
                    if(err) {return next(err);}

                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function(error) {
            console.log(error.stack);
            this.emit('end');
        })
        .pipe(rename('reddit.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
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