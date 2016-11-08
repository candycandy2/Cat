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

var env = getArg("--env");  // pro=>Product, test=>QA, dev=>Develop
var vname = getArg("--vname");
var vcode = getArg("--vcode");

var appNameDecorate = "";
var appVersionDecorate = "Production";
var apiPath = "qplayApi";
var QPushAPPKey = "1dd3ebb8bb12f1895b4a5e25";
var patchFolder = "patch";

if (env === "test") {
    appNameDecorate = "test";
    appVersionDecorate = "Staging";
    apiPath = "qplayApiTest";
    QPushAPPKey = "33938c8b001b601c1e647cbd";
    patchFolder = "patchTest";
} else if (env === "dev") {
    appNameDecorate = "dev";
    appVersionDecorate = "Development";
    QPushAPPKey = "e343504d536ebce16b70167e";
}

var configContent =   '<?xml version="1.0" encoding="utf-8"?>' + 
                    '<widget id="com.qplay.appqplay' + appNameDecorate + '" android-versionCode="' + vcode + '" ios-CFBundleVersion="' + vcode + '" ' +
                        'version="' + vname + '[' + appVersionDecorate + ']" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">' +
                        '<name>QPlay</name>' +
                        '<description>' +
                            'A sample Apache Cordova application that responds to the deviceready event.' +
                        '</description>' +
                        '<author email="dev@cordova.apache.org" href="http://cordova.io">' +
                            'Apache Cordova Team' +
                        '</author>' +
                        '<content src="index.html" />' +
                        '<access origin="*" />' +
                        '<allow-navigation href="*" />' +
                        '<allow-intent href="http://*/*" />' +
                        '<allow-intent href="https://*/*" />' +
                        '<allow-intent href="tel:*" />' +
                        '<allow-intent href="sms:*" />' +
                        '<allow-intent href="mailto:*" />' +
                        '<allow-intent href="geo:*" />' +
                        '<allow-intent href="appyellowpage' + appNameDecorate + ':*" />' +
                        '<platform name="android">' +
                            '<allow-intent href="market:*" />' +
                        '</platform>' +
                        '<platform name="ios">' +
                            '<hook type="before_compile" src="hooks/xcode8.js" />' +
                            '<allow-intent href="itms:*" />' +
                            '<allow-intent href="itms-apps:*" />' +
                        '</platform>' +
                    '</widget>';

//ex: gulp config --env test --vname 1.0.0.8 --vcode 8
gulp.task('config', function(){
    fs.writeFile('config.xml', configContent);
});

/*-------------------------------------------------------------------------------------------------*/

//ex: gulp install --env test
gulp.task('install', shell.task([
    'cordova plugin remove cordova-plugin-qlogin',
    'cordova plugin remove cordova-plugin-qpush',
    'cordova plugin remove cordova-plugin-device',
    'cordova plugin remove cordova-plugin-splashscreen',
    'cordova plugin remove cordova-plugin-console',
    'cordova plugin remove cordova-plugin-appversion',
    'cordova plugin remove cordova-plugin-customurlscheme',
    'cordova plugin remove cordova-plugin-qsecurity',
    'cordova plugin remove cordova-plugin-whitelist',
    'cordova platform rm ios',
    'cordova platform rm android',
    'cordova platform add ios',
    'cordova platform add android',
    'cordova plugin add ../../plugins/cordova-plugin-qlogin --variable LOGIN_URL=https://qplay.benq.com/' + apiPath + '/public/qplayauth_register',
    'cordova plugin add ../../plugins/cordova-plugin-qpush --variable API_KEY=' + QPushAPPKey,
    'cordova plugin add cordova-plugin-device',
    'cordova plugin add cordova-plugin-splashscreen',
    'cordova plugin add cordova-plugin-console',
    'cordova plugin add cordova-plugin-appversion',
    'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appqplay' + appNameDecorate,
    'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable ENV=' + appNameDecorate,
    'cordova plugin add cordova-plugin-whitelist'
]));

gulp.task('patch', function() {
    return gulp.src(patchFolder + '/LoginActivity.java', { base: patchFolder + '/' })
        .pipe(gulp.dest('platforms/android/src/org/apache/cordova/qlogin/', { overwrite: true }));
});

gulp.task('copyAndroidImages', function() {
    return gulp.src('Images/android/**/*', { base: 'Images/android/' })
        .pipe(gulp.dest('platforms/android/res/', { overwrite: true }));
});

gulp.task('copyIOSImages', function() {
    return gulp.src('Images/iOS/**/*', { base: 'Images/iOS/' })
        .pipe(gulp.dest('platforms/ios/QPlay/Images.xcassets/', { overwrite: true }));
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

gulp.task('componentJS', function() {
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

//ex: gulp --env test --vname 1.0.0.8 --vcode 8
gulp.task('default', ['config', 'patch', 'copyAndroidImages', 'copyIOSImages', 'componentCSS', 'componentJS', 'build'], function(){

});