var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var gulp = require('gulp'),
    combine = require('gulp-file-include'),
    less = require('gulp-less'),
    coffee = require('gulp-coffee'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('del'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    glob = require('glob'),
    es = require('event-stream'),
    watch = require('gulp-watch');


// Clean build directory
gulp.task('clean', function () {
    return clean.sync(['./build/html', './build/css/', './build/js']);
});

// Set vendor
gulp.task('lib', function () {
    return gulp.src(['./node_modules/bootstrap/dist/fonts/*.*']).pipe(gulp.dest('./build/fonts/'));
});

// Images handler
gulp.task('image', function () {
    return gulp.src('./src/img/*.*').pipe(gulp.dest('./build/img/'));
});

// Combine html files
gulp.task('combine', function () {
    return gulp.src(['./src/html/*.html'])
        .pipe(combine({
            prefix: '<!--',
            suffix: '-->',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/html/'))
        .pipe(browserSync.reload({stream: true}));
});

// Compile Coffeescript
gulp.task('coffee', function () {
    var files = glob.sync('./src/js/*.coffee');
    browserify({
        entries: files,
        debug: true,
        extensions: ['.coffee']
    })
    .transform('coffeeify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.reload({stream: true}));;
});

// Compile LESS
gulp.task('less', function () {
    return gulp.src(['./src/css/app.less'])
        .pipe(less({compress: true}))
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('./build/css/'))
});

// Watch files changing
gulp.task('watch', function () {
    gulp.watch(['./src/html/*.html', './src/html/**/*.html'], ['combine']);
    gulp.watch('./src/js/*.coffee', ['coffee']);
    gulp.watch('./src/css/*.less', ['less']);

    var files = [
        './**.html',
        './**.css',
        './**.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './build/'
        }
    });
});

gulp.task('default', ['clean', 'image', 'lib', 'combine', 'coffee', 'less', 'watch']);