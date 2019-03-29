"use strict";

// Load plugins
const sass = require("gulp-sass");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const rename = require("gulp-rename");
const terser = require('gulp-terser');


// Compile scss into css
function css() {
  return gulp.src('./public/assets/scss/*.scss')
    // compile to css
    .pipe(sass())
    // take compiled css and place into folder
    .pipe(gulp.dest('./public/bin/css/'))
    //browser realod
    .pipe(browserSync.stream());
}

// Clean assets
function clean() {
  return del(["./public/bin"]);
}

// Watch for changes. Does not work in Vagrant
function watch() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
}

// Move the javascript files into our /public/vendor folder
function js() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
      .pipe(gulp.dest("./public/bin/js"))
      .pipe(browserSync.stream());
}

// Minify Js
function es(){
  return gulp.src('./public/assets/js/app.js')
    .pipe(terser())
    .pipe(gulp.dest('./public/bin/js'))
}

const build = gulp.series(clean, gulp.parallel(css, es));

exports.css = css;
exports.js = js;
exports.watch = watch;
exports.es = es;
exports.build = build;