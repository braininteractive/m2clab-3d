'use strict';

var SRC_PATH = './src';
var DIST_PATH = './dist';

var TMP_PATH = DIST_PATH;

var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var runSequence = require('run-sequence');
var memRev = require('./utils/gulp-memrev');
var browserifyConcatFiles = require('./utils/gulp-browserify-concat');
var del = require('del');
var babelify = require('babelify');
var karma = require('karma');

var DIST = false;
var CURRENT_PATH = TMP_PATH;


gulp.task('clean', function (done) {
  del([TMP_PATH, DIST_PATH + '/**/*', !DIST_PATH + '/{models,models/**}'], done);
});

gulp.task('views', function () {
  var stream = gulp.src([
    SRC_PATH + '/views/**/*.twig',
    SRC_PATH + '/index.php',
    SRC_PATH + '/.htaccess'],
    { base: SRC_PATH });

  if (DIST) {
    stream = stream.pipe(memRev.replace());
  }

  stream = stream.pipe(gulp.dest(CURRENT_PATH));

  if (!DIST) {
    stream = stream.pipe(g.livereload());
  }

  return stream;
});

gulp.task('images', function () {
   var stream = gulp.src([SRC_PATH + '/images/**/*']);
    if (DIST) {
      stream = stream.pipe(g.imagemin());
    }
    return stream.pipe(gulp.dest(CURRENT_PATH + '/images'));
});

gulp.task('assets', function () {
    return gulp.src([
      SRC_PATH + '/fonts/**/*',
      SRC_PATH + '/models/**/*'
      // , ... more
    ], { base : SRC_PATH })
    .pipe(gulp.dest(CURRENT_PATH));
});


gulp.task('watch', function () {
  gulp.watch([
    SRC_PATH + '/**/*.php',
    SRC_PATH + '/**/*.twig' ], ['views']);

  // gulp.watch(SRC_PATH + '/**/*.html', ['html']);
  gulp.watch(SRC_PATH + '/**/*.scss', ['sass']);
  gulp.watch(SRC_PATH + '/**/*.js',   ['browserify']);
});

gulp.task('serve', function (done) {
  g.livereload.listen();
  runSequence('clean', 'lint', ['browserify', 'sass', 'assets', 'images'], 'views', 'watch', done);
});

gulp.task('sass', function () {
  var stream = gulp.src(SRC_PATH + '/sass/main.scss')
    .pipe(g.plumber({errorHandler: g.notify.onError('Sass: <%= error %>')}))
    .pipe(g.sourcemaps.init())
    .pipe(g.sass({
      includePaths: [
          './node_modules/foundation-sites/scss/',
          './node_modules/font-awesome/scss/',
          './node_modules/cl-frontend-utils/src/scss/'
      ]
    }))
    .pipe(g.autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        remove: true
      }));

  if (DIST) {
    stream = stream
      .pipe(g.rev())
      .pipe(memRev())
      .pipe(g.minifyCss());
  } else {
    stream = stream
      .pipe(g.sourcemaps.write())
      .pipe(g.livereload());
  }

  return stream.pipe(gulp.dest(CURRENT_PATH + '/css/'));
});

gulp.task('browserify', ['lint'], function() {

  var stream = gulp.src([SRC_PATH + '/js/index.js'])
    .pipe(g.plumber({errorHandler: g.notify.onError('Browserify: <%= error.message %>')}))
    .pipe(g.browserify2({
      fileName: 'bundle.js',
      transform: babelify,
      options: {
        debug: !DIST
      }
    }))
    .pipe(browserifyConcatFiles())
    .pipe(g.concat('bundle.js'));

  if (DIST) {
    stream = stream
      .pipe(g.rev())
      .pipe(memRev())
      .pipe(g.uglify());
  }

  stream = stream.pipe(gulp.dest(CURRENT_PATH + '/js/'));

  if (!DIST) stream = stream.pipe(g.livereload());
  return stream;
});

gulp.task('lint', function () {
  return gulp.src([SRC_PATH + '/js/**/*.js', '!' + SRC_PATH + '/js/vendor/**/*.js'])
    .pipe(g.plumber({errorHandler: g.notify.onError('<%= error.message %>')}))
    .pipe(g.cached('linting'))
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'))
    .pipe(g.jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.runner.run({port: 9876}, function(exitCode) {
    if (exitCode) return done('Karma tests failed');
    return done();
  });
});

gulp.task('dist', function (done) {
  DIST = true;
  CURRENT_PATH = DIST_PATH;
  runSequence('clean', 'lint', ['browserify', 'sass', 'images', 'assets'], 'views', done);
});

gulp.task('default', ['serve']);
