/**
 * Created by Paul on 4/23/2015.
 */

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

//var order = function(all) {
//  var bowers =  mainBowerFiles(all);
  //var sources = glob.sync(src);

  //var before = anysort.splice(sources, matches.before);
  //var middle = anysort.splice(before.unmatched, matches.middle);
  //var after = anysort.splice(middle.unmatched, matches.after);

  //return before.matched
  //  .concat(bowers)
  //  .concat(middle.matched)
  //  .concat(after.unmatched)
  //  .concat(after.matched)
  //  ;
  //return bowers;
//};

gulp.task('katex-fonts', function() {
  return gulp.src('./bower_components/katex-build/fonts/*')
    .pipe($.plumber())
    .pipe(gulp.dest('./dist/fonts'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('bootswatch', function() {
  return gulp.src('./bower_components/bootswatch/**/*.min.css', {base: './bower_components/bootswatch'})
    .pipe($.plumber())
    .pipe(gulp.dest('./dist/themes/layout'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('highlight', function() {
  return gulp.src('./bower_components/highlight.js/styles/*.css')
    .pipe($.plumber())
    .pipe($.minifyCss())
    .pipe(gulp.dest('./dist/themes/highlight'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});

gulp.task('bower-css', function() {
  var files = mainBowerFiles('**/*.css');
  files.push('./code/markstrap.css');
  //console.dir(files);
  return gulp.src(files)
    .pipe($.plumber())
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.init()))
    .pipe($.minifyCss())
    .pipe($.concat('vendor.css'))
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.write('./')))
    .pipe(gulp.dest('./dist'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('bower-js', function() {
  var files = mainBowerFiles('**/*.js');
  files.push('./code/markstrap.js');
  //console.dir(files);
  return gulp.src(files, { base: './' })
    .pipe($.plumber())
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.init()))
    //.pipe($.uglify())
    //.pipe(plugin.if(params.compress, plugin.uglify()))
    .pipe($.concat('vendor.js'))
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.write('./')))
    .pipe(gulp.dest('./dist'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('mark', function() {

  return gulp.src("./src/**/*.md")
    .pipe($.wrap({src: 'tmpl/wrap.html'}))
    .pipe($.rename(function (path) {
      path.extname = ".html"
    }))
    .pipe(gulp.dest("./dist"));

});


gulp.task('build', ['mark', 'bower-js', 'bower-css', 'bootswatch', 'highlight', 'katex-fonts']);

gulp.task('default', ['build']);
