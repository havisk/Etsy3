// All of our Require statements
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var babel   = require('gulp-babel');
var bower   = require('main-bower-files');
var concat  = require('gulp-concat');
var server  = require('gulp-server-livereload');

// Simple Notify Function
var notifyError = function() {
  return plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  });
}

// Gulp Watch Command
gulp.task('watch', ['watchfiles', 'webserver']);

// Livereload Server
gulp.task('webserver', function () {
  return gulp.src('app')
    .pipe(server({
      livereload: true
    }));
});

// Watch Task to watch certain files
gulp.task('watchfiles', function() {

  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./src/*.js', ['babel']);
  gulp.watch('bower.json', ['bower']);

});

// SASS Task to compile sass using `node-sass`
gulp.task('sass', function(){

  gulp.src('./src/*.scss')
    .pipe( notifyError() )
    .pipe( sass() )
    .pipe( gulp.dest('./app/css') );

});

// Babel task to transpile ES2015/ES6 code to ES5
gulp.task('babel', function() {
  gulp.src('./src/*.js')
    .pipe( notifyError() )
    .pipe( babel() )
    .pipe( gulp.dest('./app/js') );
});

// Bower Task which will pull the main bower files out of our bower_components
gulp.task('bower', ['bower:js', 'bower:css']);

gulp.task('bower:js', function() {
  var files = bower({filter: '**/*.js'});

  gulp.src(files)
    .pipe( notifyError() )
    .pipe( concat('vendor.js') )
    .pipe(gulp.dest('./app/js'));
});

gulp.task('bower:css', function() {
  var files = bower({filter: ['**/*.css', '**/*.scss'] });

  gulp.src(files)
    .pipe( notifyError() )
    .pipe( sass() )
    .pipe( concat('vendor.css') )
    .pipe(gulp.dest('./app/css'));
});
