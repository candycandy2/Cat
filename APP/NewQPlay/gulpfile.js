////////////////////////////////////////
//Install
//windows =>npm install -g gulp
//mac =>sudo npm install -g gulp
//=>npm install --save-dev gulp
//=>npm install gulp-concat gulp-less gulp-uglify gulp-copy
//UglifyJS – a JavaScript parser/compressor/beautifier
////////////////////////////////////////
//Run
//By default gulpfile.js default
//=>gulp
////////////////////////////////////////

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var shell = require('gulp-shell')
//var copy = require('gulp-copy');

gulp.task('copy',function(){
    return gulp.src('Images/iOS/**/*', {base: 'Images/iOS/'})
        .pipe(gulp.dest('platforms/ios/QPlay/Images.xcassets/',{overwrite: true}));
});

gulp.task('copyProfile',function(){
    return gulp.src('Profile/*', {base: 'Profile/'})
        .pipe(gulp.dest('platforms/ios/QPlay/',{overwrite: true}));
});

gulp.task('install', shell.task([
  'cordova platform rm ios',
  'cordova platform rm android',
  'cordova platform add ios',
  'cordova platform add android',
  'cordova plugin add ../../plugins/cordova-plugin-qsecurity/',
  'cordova plugin add ../../plugins/cordova-plugin-qlogin/',
  'cordova plugin add cordova-plugin-device',
  'cordova plugin add cordova-plugin-splashscreen'
]));

gulp.task('build', shell.task([
  'cordova build ios --debug --device --buildConfig=build.json',
]))

gulp.task('componentCSS',function(){
    return gulp.src('../component/*.css')
        .pipe(gulp.dest('www/css/'));
});
/*
gulp.task('less',function(){
    return gulp.src('www/src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('www/src/css/'));
});

gulp.task('concat:css', ['less'], function(){
    return gulp.src('www/src/css/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('www/dist/css'));
});
*/

gulp.task('componentJS',function(){
    return gulp.src('../component/*.js')
        .pipe(gulp.dest('www/js/'));
});
/*
gulp.task('concat:js', function(){
    return gulp.src(['www/src/js/config.js','src/js/hello.js','src/js/main.js'])
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('www/dist/js'));
});

gulp.task('default', ['concat:js', 'concat:css'], function(){
    return gulp.src('www/src/index.html')
        .pipe(gulp.dest('www/dist'));
});
*/
gulp.task('default', ['copy', 'copyProfile', 'componentCSS', 'componentJS', 'build'], function(){

});
