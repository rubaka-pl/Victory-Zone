const { src, dest, watch, series } = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css'); // Плагин для минификации CSS
const terser = require('gulp-terser'); // Плагин для минификации JavaScript
const replace = require('gulp-replace');


// Clean task
const clean = () => del(['./public']);

// HTML task
const html = () => {
  return src('./src/html/**/*.html')
    .pipe(plumber())
    .pipe(size({ title: 'HTML before' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(size({ title: 'HTML after' }))
    .pipe(dest('./public'));
};

// Styles task (SCSS to CSS)
const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS()) 
    .pipe(replace(/url\(\s*['"]?\/img\//g, 'url("../img/'))
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream());
};

// Scripts task (JavaScript)
const scripts = () => {
  return src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(terser())
    .pipe(dest('./public/js'))
    .pipe(browserSync.stream());
};

// PHP task
const php = () => {
  return src('./src/**/*.php')
    .pipe(plumber())
    .pipe(dest('./public'));
};

// Images task
const images = () => {
  return src('./src/img/**/*.{webp,svg,jpg,png}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(dest('./public/img'));
};

// Server task
const server = () => {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  watch('./src/html/**/*.html', html);
  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/**/*.php', php);
  watch('./src/img/**/*.{webp,svg,jpg,png}', images);
};

// Build task
const build = series(clean, html, styles, scripts, php, images);

// Default task
exports.default = build;
exports.build = build;
exports.watch = series(build, server);
