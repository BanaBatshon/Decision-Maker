"use strict";

// Load plugins
const sass = require("gulp-sass");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");

// Compile scss into css
function css() {
  return gulp.src('./public/scss/**/*.scss')
    // compile to css
    .pipe(sass())
    // take compiled css and place into folder
    .pipe(gulp.dest('./public/assets/css'))
    //browser realod
    .pipe(browserSync.stream());
}

// Move the javascript files into our /public/vendor folder
function js() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
      .pipe(gulp.dest("public/assets/js"))
      .pipe(browserSync.stream());
}

// Clean assets
function clean() {
  return del(["./public/assets"]);
}

// watch for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(css, js));

exports.css = css;
exports.js = js;
exports.watch = watch;
exports.build = build;