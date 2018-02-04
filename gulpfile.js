// Based on http://blog.pagepro.co/2016/11/22/creating-amp-boilerplate-with-sass/

const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const fs = require('fs-extra')
const inject = require('gulp-inject-string')
const browser = require('browser-sync')
const reload = browser.reload
const runSequence = require('run-sequence')

gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist'))
})

gulp.task('html', function () {
  const cssContent = fs.readFileSync('./dist/main.css', 'utf8')

  return gulp.src('./src/html/*.html')
    .pipe(inject.after('style amp-custom>', cssContent))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({
      stream: true
    }))
})

gulp.task('serve', function () {
  return browser({
    port: 4500,
    open: false,
    ghostMode: false,
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('assets', function () {
  return gulp.src('./src/assets/**')
    .pipe(gulp.dest('./dist/assets'))
})

gulp.task('favicon', function () {
  return gulp.src('./src/favicon/**')
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', function () {
  return fs.remove('./dist/')
})

gulp.task('watch', function () {
  gulp.watch('./src/sass/**', ['sass'])
  gulp.watch('./dist/*.css', ['html'])
  gulp.watch('./src/html/*.html', ['html'])
  gulp.watch('./src/assets/**', ['assets'])
})

gulp.task('build', function () {
  return runSequence(
    'clean',
    ['favicon', 'assets', 'sass'],
    'html'
  )
})

gulp.task('default', function () {
  return runSequence(
    'build',
    ['watch', 'serve']
  )
})
