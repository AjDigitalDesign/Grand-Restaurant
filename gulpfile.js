var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSyn = require('browser-sync');
var reload = browserSyn.reload;
var prefix = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
   sassSource : 'src/scss/*.scss',
   htmlSource : 'src/*.html',
   htmPartialsSource : 'src/partials/*.html',
   jsSource : 'src/js/**',
   imgSource : 'src/img/**'
}


var APPATH = {
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  img : 'app/img'
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

// Creat HTML partials
gulp.task('html', function(){
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPATH.root))
});

gulp.task('sass', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)
      .pipe(prefix('last 2 versions'))
      .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    return merge(sassFiles, bootstrapCSS)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPATH.css));
});

// Minify all images
gulp.task('images', function(){
  return gulp.src(SOURCEPATHS.imgSource)
  .pipe(newer(APPATH.img))
  .pipe(imagemin())
  .pipe(gulp.dest(APPATH.img));
});


gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPATH.js))
});


/** Production Tasks **/
gulp.task('compress', function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(APPATH.js))
});

gulp.task('compresscss', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)
      .pipe(prefix('last 2 versions'))
      .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    return merge(sassFiles, bootstrapCSS)
      .pipe(concat('app.css'))
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(APPATH.css));
});

gulp.task('minifyHtml', function(){
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(APPATH.root))
});


/*
gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPATH.root))
})
*/

gulp.task('serve', ['sass'], function(){
    browserSyn.init([APPATH.css + '/*.css', APPATH.root + '/*.html', APPATH.js + '/*.js'], {
      server: {
        baseDir : APPATH.root
      }
    })
});

gulp.task('watch', ['serve', 'sass', 'clean-html','clean-scripts', 'scripts', 'images', 'html'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmPartialsSource], ['html']);
});

gulp.task('default', ['watch']);

gulp.task('production', ['compress','compresscss','minifyHtml']);
