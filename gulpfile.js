'use strict'

var gulp = require('gulp');
var plugins=require('gulp-load-plugins')();
var concat=require('gulp-concat');
var minifycss=require('gulp-minify-css');
var imagemin=require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');

gulp.task('serve', function () {
   var files = [
      './src/**/*.html',
      './src/css/**/*.css',
      './src/images/**/*.*',
      './src/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './src/'
      }
   });
});
gulp.task('minify',function(){
	gulp.src(['./src/css/mui.min.css','./src/css/mui.min.css','./src/css/iconfont.css','./src/css/mui.indexedlist.css','./src/css/carinfo.css','./src/css/common.css','./src/css/carinfo_report.css','./src/css/animate.min.css','./src/css/mui.picker.css','./src/css/mui.poppicker.css','./src/css/chetongxiang.css']).pipe(minifycss()).pipe(concat('chetongxiang.css')).pipe(gulp.dest('./build/css/'));
	gulp.src(['./src/js/angular.min.js','./src/js/angular-ui-router.min.js','./src/js/angular-touch.min.js','./src/js/angular-resource.min.js','./src/js/angular-animate.min.js','./src/js/zepto.js','./src/js/mui.min.js','./src/js/mui.indexedlist.js','./src/js/mui.picker.min.js','./src/js/mui.poppicker.js','./src/js/city.data-3.js','./src/js/mui.pullToRefresh.js','./src/js/mui.pullToRefresh.material.js','./src/js/chetongxiang.js','./src/js/app.js','./src/js/controllers.js','./src/js/controllers-de.js','./src/js/services.js','./src/js/filter.js','./src/js/directive.js']).pipe(plugins.uglify()).pipe(concat('chetongxiang.js')).pipe(gulp.dest('./build/js/'));
    gulp.src(['./src/partials/**/*.*']).pipe(htmlmin()).pipe(gulp.dest('./build/partials/'));
    gulp.src(['./src/images/**/*.*']).pipe(imagemin()).pipe(gulp.dest('./build/images/'));
    //gulp.src(['./src/data/**/*.json']).pipe(plugins.uglify()).pipe(gulp.dest('./build/data/'));
    //gulp.src(['./src/fonts/**/*.*']).pipe(plugins.uglify()).pipe(gulp.dest('./build/fonts/'));
});
gulp.task('inject',function(){
	var injectStyle=gulp.src(['./build/css/**/*.css'],{read: false});
	var indectJs=gulp.src(['./build/js/**/*.js'],{read: false});
	var target=gulp.src('./build/index.html');
	target.pipe(plugins.inject(injectStyle)).pipe(plugins.inject(indectJs)).pipe(gulp.dest('./build/'));
})