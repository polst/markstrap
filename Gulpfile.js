/**
 * Created by Paul on 4/23/2015.
 */

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
//var sfa = require('stream-from-array');

var s = require("underscore.string");
_.mixin(s.exports());

//var fs = require('fs');
//var ps = require('path');
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

var codeThemes = [], layoutThemes = [];

gulp.task('bootswatch', function() {
  //var themes = [];
  return gulp.src('./bower_components/bootswatch/**/*.min.css', {base: './bower_components/bootswatch'})
    .pipe($.plumber())
    .pipe($.rename(function (path) {
      //console.log(path);
      layoutThemes.push(path.dirname);
    }))
    .pipe(gulp.dest('./dist/themes/layout'))
    //.pipe(browserSync.reload({stream:true}))
    ;
});

gulp.task('layout-menu', function() {
  return gulp.src('tmpl/menu.html')
    .pipe($.template({ menu: 'Themes', themes: layoutThemes }))
    .pipe($.rename(function (path) {
      path.basename = "MenuLayoutThemes"
    }))
    .pipe(gulp.dest('tmp/'));
});


gulp.task('code-menu', function() {
  return gulp.src('tmpl/menu.html')
    .pipe($.template({ menu: 'Highlight', themes: codeThemes }))
    .pipe($.rename(function (path) {
      path.basename = "MenuCodeThemes"
    }))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('highlight', function() {
  var themes = [];
  return gulp.src('./bower_components/highlight.js/styles/*.css')
    .pipe($.plumber())
    .pipe($.rename(function (path) {
      //console.log(path);
      codeThemes.push(path.basename);
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('./dist/themes/highlight'))
    .on('end', function() {
      //console.log(codeThemes);
    })
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
    //.pipe($.minifyCss())
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

gulp.task('layout', function() {
  return gulp.src([
    'tmpl/header.html',
    'tmpl/nav-header.html',
    'tmp/locations.html',
    'tmp/MenuCodeThemes.html',
    'tmp/MenuLayoutThemes.html',
    'tmpl/nav-footer.html',
    'tmpl/footer.html'
  ])
    .pipe($.concat('layout.html'))
    .pipe(gulp.dest('./tmp/'))
  ;
});

//function FormatNumberLength(num, length) {
//  var r = "" + num;
//  while (r.length < length) {
//    r = "0" + r;
//  }
//  return r;
//}

gulp.task('toc', function() {
  return gulp.src("./src/**/*.md", { base: './src/' })
    .pipe($.filelist('toc.json'))
    .pipe($.data(function(file) {
      var content = JSON.parse(file.contents.toString());
      var newContent = {};

      _.forEach(content, function(rec) {
        var frags = rec.split('/');
        if(frags.length > 1) {
          var key = frags.shift();
          if(!newContent[key])
            newContent[key] = [];
          newContent[key].push(frags.join('/').slice(0, -3));
        }
        else {
          if(!newContent['/'])
            newContent['/'] = [];
          newContent['/'].push(rec.slice(0, -3));
        }
      });

      var m = _.map(newContent, function(v, k) {
        var name = k,
          count = 0;
        if(k !== '/') {
          name = k.slice(3);
          count = parseInt(k.slice(0,2));
        }
        var items = _.map(v, function(item) {
          return item.slice(3);
        });
        return { count: count, name: name, items: items};
      });

      file.contents = new Buffer(JSON.stringify(m));
    }))
    .pipe(gulp.dest('./tmp/'))
  ;
});

gulp.task('menus', function() {
  return gulp.src('tmpl/nav.html')
    .pipe($.data(function() {
      var toc = require('./tmp/toc.json');
      return { locations: toc };
    }))
    .pipe($.template())
    .pipe($.rename(function (path) {
      path.basename = "locations"
    }))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('mark', function() {
  return gulp.src("./src/**/*.md", { base: './src/' })
    .pipe($.wrap({src: 'tmp/layout.html'}))
    .pipe($.rename(function (path) {
      path.extname = ".html";
      path.basename = path.basename.slice(3);
      if(path.dirname !== '.') path.dirname = path.dirname.slice(3);
    }))
    .pipe(gulp.dest("./dist"));

});


gulp.task('build', $.sequence(
  [ 'bower-js', 'bower-css', 'bootswatch', 'highlight', 'katex-fonts' ]
  ,
  [ 'layout-menu', 'code-menu', 'toc' ]
  ,
  'menus'
  ,
  'layout'
  ,
  'mark'
));

gulp.task('default', ['build']);
