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

var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var shell = require('gulp-shell')
//var copy = require('gulp-copy');

/*-----------------------------------------edit config.xml------------------------------------------*/
function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

var env = getArg("--env");  
var vname = getArg("--vname");
var vcode = getArg("--vcode");

var appNameDecorate = "";
var appVersionDecorate = "Production";
var patchFolder = "patch";

if (env === "test") {
    appNameDecorate = "test";
    appVersionDecorate = "NewStaging";
    patchFolder = "patchTest";
} else if (env === "dev") {
    appNameDecorate = "dev";
    appVersionDecorate = "Development";
}

var schemeSetting = "<string>appqplay" + appNameDecorate + "</string><string>appens" + appNameDecorate + "</string>";

var configContent =   '<?xml version="1.0" encoding="utf-8"?>' +
                    '<widget id="com.qplay.appens' + appNameDecorate + '" android-versionCode="' + vcode + '" ios-CFBundleVersion="' + vcode + '" ' +
                        'version="' + vname + '[' + appVersionDecorate + ']" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">' +
                        '<name>ENS</name>' +
                        '<description>' +
                            'A sample Apache Cordova application that responds to the deviceready event.' +
                        '</description>' +
                        '<author email="dev@cordova.apache.org" href="http://cordova.io">' +
                            'Apache Cordova Team' +
                        '</author>' +
                        '<content src="index.html" />' +
                        '<preference name="orientation" value="portrait" />' +
                        '<access origin="*" />' +
                        '<access origin="tel:*" launch-external="yes" />' +
                        '<allow-navigation href="*" />' +
                        '<allow-intent href="http://*/*" />' +
                        '<allow-intent href="https://*/*" />' +
                        '<allow-intent href="tel:*" />' +
                        '<allow-intent href="sms:*" />' +
                        '<allow-intent href="mailto:*" />' +
                        '<allow-intent href="geo:*" />' +
                        '<allow-intent href="appqplay' + appNameDecorate + ':*" />' +
                        '<allow-intent href="*:*" />' +
                        '<platform name="android">' +
                            '<allow-intent href="market:*" />' +
                            '<preference name="AndroidLaunchMode" value="singleTask"/>' +
                        '</platform>' +
                        '<platform name="ios">' +
                            '<hook type="before_compile" src="hooks/xcode8.js" />' +
                            '<allow-intent href="itms:*" />' +
                            '<allow-intent href="itms-apps:*" />' +
                        '</platform>' +
                        '<plugin name="cordova-connectivity-monitor" spec="~1.2.2" />' +
                    '</widget>';

gulp.task('config', function(){
    fs.writeFile('config.xml', configContent);
});

/*-------------------------------------------------------------------------------------------------*/
//ex: gulp install --env test   
gulp.task('install', shell.task([
  'cordova plugin remove cordova-plugin-device',
  'cordova plugin remove cordova-plugin-console',
  'cordova plugin remove cordova-plugin-appversion',
  'cordova plugin remove cordova-plugin-customurlscheme',
  'cordova plugin remove cordova-plugin-qsecurity',
  'cordova plugin remove cordova-plugin-whitelist',
  'cordova platform rm ios',
  'cordova platform rm android', 
  'cordova platform add ios', 
  'cordova platform add android',
  'cordova plugin add cordova-plugin-device',
  'cordova plugin add cordova-plugin-console',
  'cordova plugin add cordova-plugin-appversion',
  'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appens' + appNameDecorate,
  'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
  'cordova plugin add cordova-plugin-whitelist'
]));

gulp.task('jenkinsinstall', shell.task([
  'cordova platform add ios',
  'cordova platform add android',
  'cordova plugin add cordova-plugin-device',
  'cordova plugin add cordova-plugin-console',
  'cordova plugin add cordova-plugin-appversion',
  'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appens' + appNameDecorate,
  'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
  'cordova plugin add cordova-plugin-whitelist'
]));

gulp.task('copyAndroidImages', function() {
    return gulp.src('Images/Launch_icon/android/**/*', {base: 'Images/android/'})
        .pipe(gulp.dest('platforms/android/res/',{overwrite: true}));
});

gulp.task('copyIOSImages', function() {
    return gulp.src('Images/Launch_icon/iOS/AppIcon.appiconset/*')
        .pipe(gulp.dest('platforms/ios/yellowpage/Images.xcassets/AppIcon.appiconset/', { overwrite: true }));
});

gulp.task('copyIOSLaunchImages', function() {
    return gulp.src('../component/LaunchImage.launchimage/*')
        .pipe(gulp.dest('platforms/ios/yellowpage/Images.xcassets/LaunchImage.launchimage/', { overwrite: true }));
});

gulp.task('build', shell.task([
    'cordova build ios --debug --device --buildConfig=build.json',
]))

gulp.task('componentCSS', function() {
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

gulp.task('componentHTML', function() {
    return gulp.src('../component/*.html')
        .pipe(gulp.dest('www/View/'));
});

gulp.task('componentIMG', function() {
    return gulp.src('../component/image/*')
        .pipe(gulp.dest('www/img/component/'));
});

gulp.task('functionJS', function() {
    return gulp.src('../component/function/*.js')
        .pipe(concat('function.js'))
        .pipe(gulp.dest('../component/'));
});

gulp.task('appJS', ['functionJS'], function(){
    return gulp.src(['../component/component.js','../component/function.js'])
        //.pipe(uglify())
        //.pipe(concat('app.min.js'))
        .pipe(concat('APP.js'))
        .pipe(gulp.dest('www/js/'));
});

gulp.task('componentJS', ['appJS'], shell.task([
    'rm ../component/function.js'
]));

//ex: gulp default
//remove petch task
gulp.task('default', ['copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG', 'build'], function(){
});
