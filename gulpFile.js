var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
// var watch = require('gulp-watch');
var size = require('gulp-size');
var ngAnnotate = require('gulp-ng-annotate');
var cleanCSS = require('gulp-clean-css');
var paths = require('./gulp-config.json');
var htmlmin = require('gulp-htmlmin');
var rename = require("gulp-rename");


gulp.task('login-css', function() {
  var stream = gulp.src(paths.login_css)
    .pipe(concat('login.css'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(concat('login.min.css'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('client/public/dist/_login/'));

  return stream;
});

gulp.task('login-js', function() {
  var stream = gulp.src(paths.login_js)
    .pipe(concat('login.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(uglify({
      // mangle: false
    }).on('error', function(err) {
      console.log(err);
    }))
    .pipe(concat('login.min.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('client/public/dist/_login/'));

  return stream;
});


gulp.task('login-controller', function() {
  var stream = gulp.src(paths.login_controller)
    .pipe(concat('login-controller.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(ngAnnotate())
    .pipe(uglify({
      // mangle: false
    }).on('error', function(err) {
      console.error(err);
    }))
    .pipe(concat('login-controller.min.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('client/public/dist/_login/'));

  return stream;
});

gulp.task('index-controller', function() {
  var stream = gulp.src(paths.index_controller)
    .pipe(concat('index-controller.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(ngAnnotate())
    // .pipe(uglify({
      // mangle: false
    // }).on('error', function(err) {
      // console.error(err);
    // }))
    .pipe(concat('index-controller.min.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('client/public/controllers/'));

  return stream;
});

gulp.task('build-html', function() {
  var stream = gulp.src(paths.html)
    // .pipe(size({
    //  showFiles: true
    // }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(rename(function(path) {
      path.dirname = "";
      path.basename += ".min";
    }))
    // .pipe(size({
    //  showFiles: true
    // }))
    .pipe(gulp.dest('client/public/views/'));

  return stream;
});

gulp.task('build-all', [
  'login-css',
  'login-js',
  'login-controller',
  'index-controller',
  'build-html'
], function() {});

// start server and watch files for development
gulp.task('start', [
  // 'login-css',
  // 'login-js',
  'login-controller',
  'index-controller',
  'build-html'
], function() {
  nodemon({
    script: 'bin/www',
    ext: 'js json html',
    // we don't want min files to watch,
    // because they will make a infity loop
    ignore: [
      '*.min.*'
    ],
    env: {
      'NODE_ENV': 'development'
    },
    tasks: [
      // 'login-css',
      // 'login-js',
      'login-controller',
      'index-controller',
      'build-html'
    ]
  }).on('restart', function(file) {
    // console.log('restarted! for file -> ' + file);
  })
});
