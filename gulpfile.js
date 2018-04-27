var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSyn = require('browser-sync');
var reload = browserSyn.reload;
var prefix = require('gulp-autoprefixer');
var clean = require('gulp-clean');

var SOURCEPATHS = {
   sassSource : 'src/scss/*.scss',
   htmlSource : 'src/*.html',
   jsSource : 'src/js/**'
}


var APPATH = {
  root: 'app/',
  css : 'app/css',
  js : 'app/js'
}


//Clean all Html codes
gulp.task('clean-html', function(){
  return gulp.src(APPATH.root + '/*.html', {read: false, force: true})
  .pipe(clean());
})


//clean All Javascript scripts
gulp.task('clean-scripts', function(){
  return gulp.src(APPATH.js + '/*.js', {read: false, force: true})
  .pipe(clean());
})

gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(prefix('last 2 versions'))
    .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    .pipe(gulp.dest(APPATH.css));
});

gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(gulp.dest(APPATH.js))
});



gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPATH.root))
})

gulp.task('serve', ['sass'], function(){
    browserSyn.init([APPATH.css + '/*.css', APPATH.root + '/*.html', APPATH.js + '/*.js'], {
      server: {
        baseDir : APPATH.root
      }
    })
});

gulp.task('watch', ['serve', 'sass','copy', 'clean-html','clean-scripts', 'scripts'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
