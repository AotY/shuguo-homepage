var gulp = require('gulp');
var sass = require('gulp-sass'); // SASS plugin for gulp
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css'); // minify css with clean-css.
var rename = require("gulp-rename"); // gulp-rename is a gulp plugin to rename files easily.
var uglify = require('gulp-uglify'); // minify JavaScript with UglifyJS3.
var pkg = require('./package.json');
var browserSync = require('browser-sync').create(); //
var pug = require('gulp-pug');


/**
 * Easy scroll animations for web and mobile browsers. scrollreveal
 *
 gulp the default task that builds everything
 gulp dev browserSync opens the project in your default browser and live reloads when changes are made
 gulp sass compiles SCSS files into CSS
 gulp minify-css minifies the compiled CSS file
 gulp minify-js minifies the themes JS file
 gulp copy copies dependencies from node_modules to the vendor directory


 * Matches 0 or more characters in a single path portion
 ? Matches 1 character
 [...] Matches a range of characters, similar to a RegExp range. If the first character of the range is ! or ^ then it matches any character not in the range.
 !(pattern|pattern|pattern) Matches anything that does not match any of the patterns provided.
 ?(pattern|pattern|pattern) Matches zero or one occurrence of the patterns provided.
 +(pattern|pattern|pattern) Matches one or more occurrences of the patterns provided.
 *(a|b|c) Matches zero or more occurrences of the patterns provided
 @(pattern|pat*|pat?erN) Matches exactly one of the patterns provided
 ** If a "globstar" is alone in a path portion, then it matches zero or more directories and subdirectories searching for matches. It does not crawl symlinked directories.
 *
 *
 *
 */


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {
    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ]).pipe(gulp.dest('./vendor/bootstrap'))

    // Font Awesome
    gulp.src([
        './node_modules/font-awesome/**/*',
        '!./node_modules/font-awesome/{less,less/*}',
        '!./node_modules/font-awesome/{scss,scss/*}',
        '!./node_modules/font-awesome/.*',
        '!./node_modules/font-awesome/*.{txt,json,md}'
    ]).pipe(gulp.dest('./vendor/font-awesome'))

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ]).pipe(gulp.dest('./vendor/jquery'))

    // jQuery Easing
    gulp.src([
        './node_modules/jquery.easing/*.js'
    ]).pipe(gulp.dest('./vendor/jquery-easing'))

    // Magnific Popup
    gulp.src([
        './node_modules/magnific-popup/dist/*'
    ]).pipe(gulp.dest('./vendor/magnific-popup'))

    // Scrollreveal
    gulp.src([
        './node_modules/scrollreveal/dist/*.js'
    ]).pipe(gulp.dest('./vendor/scrollreveal'))

});


// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// CSS 编译scss文件然后minifycss
gulp.task('css', ['css:compile', 'css:minify']);


// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

// JS minify js文件
gulp.task('js', ['js:minify']);


// 编译pug 文件
gulp.task('pug', function buildHTML() {
    return gulp.src([
        './pug/*.pug',
        './pug/**/*.pug'
    ]).pipe(pug({})) // Your options in here.
      .pipe(gulp.dest('./')); // ./html
});

gulp.task('pug-watch', function () {
    gulp.watch([
        './pug/*.pug',
        './pug/**/*.pug'
    ], ['pug']);
});

// Default task 没有指定任务默认执行default
gulp.task('default', ['css', 'js', 'vendor']);


// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Dev task
gulp.task('dev', ['pug', 'pug-watch', 'css', 'js', 'browserSync'], function () {
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
    // gulp.watch('./pug/*.pug', ['pug', browserSync.reload]);
    gulp.watch('./*.html', browserSync.reload);
});

// gulp.watch 检测文件的修改


