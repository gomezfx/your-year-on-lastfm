var gulp = require('gulp'); 
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
  return gulp.src('./dist/')
    .pipe(clean());
});

gulp.task('copy-css', ['clean'], function() {
  gulp.src('./assets/css/**/*')
    .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('copy-fonts', ['clean'], function() {
  gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('copy-img', ['clean'], function() {
  gulp.src('./assets/img/**/*')
    .pipe(gulp.dest('./dist/assets/img'));
});

gulp.task('jade', ['clean'], function() {
  gulp.src('*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('uglify', ['clean'], function() {
  gulp.src('./assets/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'))
});
gulp.task('default', ['clean', 'copy-css', 'copy-fonts', 'copy-img', 'jade', 'uglify']);
