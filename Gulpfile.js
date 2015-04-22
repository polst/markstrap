/**
 * Created by Paul on 4/23/2015.
 */

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

var order = function(all) {
  var bowers =  mainBowerFiles(all);
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
  return bowers;
};


gulp.task('bower-css', function() {
  //var cfg = config.bower;
  //var params = config.params;
  var files = order('**/*.css');
  console.dir(files);
  return gulp.src(files)
    .pipe($.plumber())
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.init()))
    .pipe($.minifyCss())
    //.pipe(plugin.concat(cfg.out + '.css'))
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.write('./')))
    .pipe(gulp.dest('./dist/themes'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('bower-js', function() {
  //var cfg = config.bower;
  //var params = config.params;
  var files = order('**/*.js');
//console.dir(files);
  //console.dir(files);
  return gulp.src(files, { base: './' })
    .pipe($.plumber())
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.init()))
    .pipe($.uglify())
    //.pipe(plugin.if(params.compress, plugin.uglify()))
    .pipe($.concat('vendor.js'))
    //.pipe(plugin.if(params.srcmaps, plugin.sourcemaps.write('./')))
    .pipe(gulp.dest('./dist'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});


gulp.task('mark', function() {

  gulp.src("./src/**/*.md")
    .pipe($.wrap({src: 'tmpl/wrap.html'}))
    .pipe($.rename(function (path) {
      path.extname = ".html"
    }))
    .pipe(gulp.dest("./dist"));

});


gulp.task('default', ['mark', 'bower-js', 'bower-css']);