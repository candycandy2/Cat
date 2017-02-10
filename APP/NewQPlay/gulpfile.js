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
var apiServerURL = "https://qplay.benq.com/";
var QPushAPPKey = "1dd3ebb8bb12f1895b4a5e25";
var patchFolder = "patch";

if (env === "test") {
    appNameDecorate = "test";
    appVersionDecorate = "NewStaging";
    apiServerURL = "https://qplaytest.benq.com/";
    QPushAPPKey = "33938c8b001b601c1e647cbd";
    patchFolder = "patchTest";
} else if (env === "dev") {
    appNameDecorate = "dev";
    appVersionDecorate = "Development";
    apiServerURL = "https://qplaydev.benq.com/";
    QPushAPPKey = "e343504d536ebce16b70167e";
    patchFolder = "patchDev";
}

var schemeSetting =   "<string>appqplay"    + appNameDecorate + "</string>"
                    + "<string>appyellowpage"+appNameDecorate + "</string>"
                    + "<string>appcalendar" + appNameDecorate + "</string>"
                    + "<string>apprrs"      + appNameDecorate + "</string>"
                    + "<string>appaccounting"+appNameDecorate + "</string>"
                    + "<string>appens"      + appNameDecorate + "</string>"
                    + "<string>appeis"      + appNameDecorate + "</string>"
                    + "<string>appleave"    + appNameDecorate + "</string>"
                    + "<string>appscheme01" + appNameDecorate + "</string>"
                    + "<string>appscheme02" + appNameDecorate + "</string>"
                    + "<string>appscheme03" + appNameDecorate + "</string>"
                    + "<string>appscheme04" + appNameDecorate + "</string>"
                    + "<string>appscheme05" + appNameDecorate + "</string>"
                    + "<string>appscheme06" + appNameDecorate + "</string>"
                    + "<string>appscheme07" + appNameDecorate + "</string>"
                    + "<string>appscheme08" + appNameDecorate + "</string>"
                    + "<string>appscheme09" + appNameDecorate + "</string>"
                    + "<string>appscheme10" + appNameDecorate + "</string>"
                    + "<string>appscheme11" + appNameDecorate + "</string>"
                    + "<string>appscheme12" + appNameDecorate + "</string>"
                    + "<string>appscheme13" + appNameDecorate + "</string>"
                    + "<string>appscheme14" + appNameDecorate + "</string>"
                    + "<string>appscheme15" + appNameDecorate + "</string>"
                    + "<string>appscheme16" + appNameDecorate + "</string>"
                    + "<string>appscheme17" + appNameDecorate + "</string>"
                    + "<string>appscheme18" + appNameDecorate + "</string>"
                    + "<string>appscheme19" + appNameDecorate + "</string>"
                    + "<string>appscheme20" + appNameDecorate + "</string>";

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
                        '<preference name="orientation" value="portrait" />' +
                        '<access origin="*" />' +
                        '<allow-navigation href="*" />' +
                        '<allow-intent href="http://*/*" />' +
                        '<allow-intent href="https://*/*" />' +
                        '<allow-intent href="tel:*" />' +
                        '<allow-intent href="sms:*" />' +
                        '<allow-intent href="mailto:*" />' +
                        '<allow-intent href="geo:*" />' +
                        '<allow-intent href="appyellowpage'+appNameDecorate + ':*" />' +
                        '<allow-intent href="apprrs' +      appNameDecorate + ':*" />' +
                        '<allow-intent href="appeis' +      appNameDecorate + ':*" />' +
                        '<allow-intent href="appcalendar' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appens' +      appNameDecorate + ':*" />' +
                        '<allow-intent href="appaccounting'+appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme01' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme02' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme03' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme04' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme05' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme06' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme07' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme08' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme09' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme10' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme11' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme12' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme13' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme14' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme15' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme16' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme17' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme18' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme19' + appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme20' + appNameDecorate + ':*" />' +
                        '<platform name="android">' +
                            '<allow-intent href="market:*" />' +
                            '<preference name="AndroidLaunchMode" value="singleTask"/>' +
                            '<preference name="AndroidPersistentFileLocation" value="Compatibility" />' +
                        '</platform>' +
                        '<platform name="ios">' +
                            '<hook type="before_compile" src="hooks/xcode8.js" />' +
                            '<allow-intent href="itms:*" />' +
                            '<allow-intent href="itms-apps:*" />' +
                            '<preference name="iosPersistentFileLocation" value="Compatibility" />' +
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
    'cordova plugin remove cordova-plugin-console',
    'cordova plugin remove cordova-plugin-appversion',
    'cordova plugin remove cordova-plugin-customurlscheme',
    'cordova plugin remove cordova-plugin-qsecurity',
    'cordova plugin remove cordova-plugin-whitelist',
    'cordova plugin remove cordova-plugin-inappbrowser',
    'cordova plugin remove cordova-plugin-appavailability',
    'cordova plugin remove cordova-plugin-file',
    'cordova platform rm ios',
    'cordova platform rm android',
    'cordova platform add ios',
    'cordova platform add android',
    'cordova plugin add ../../plugins/cordova-plugin-qlogin --variable LOGIN_URL=' + apiServerURL + 'qplayApi/public/qplayauth_register',
    'cordova plugin add ../../plugins/cordova-plugin-qpush --variable API_KEY=' + QPushAPPKey,
    'cordova plugin add cordova-plugin-device',
    'cordova plugin add cordova-plugin-console',
    'cordova plugin add cordova-plugin-appversion',
    'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appqplay' + appNameDecorate,
    'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
    'cordova plugin add cordova-plugin-whitelist',
    'cordova plugin add cordova-plugin-inappbrowser',
    'cordova plugin add cordova-plugin-appavailability',
    'cordova plugin add cordova-plugin-file'
]));

gulp.task('jenkinsinstall', shell.task([
    'cordova platform add ios@4.3.1',
    'cordova platform add android@6.0.0',
    'cordova plugin add ../../plugins/cordova-plugin-qlogin --variable LOGIN_URL=' + apiServerURL + 'qplayApi/public/qplayauth_register',
    'cordova plugin add ../../plugins/cordova-plugin-qpush --variable API_KEY=' + QPushAPPKey,
    'cordova plugin add cordova-plugin-device@1.1.4',
    'cordova plugin add cordova-plugin-console@1.0.5',
    'cordova plugin add cordova-plugin-appversion@1.0.0',
    'cordova plugin add cordova-plugin-customurlscheme@4.2.0 --variable URL_SCHEME=appqplay' + appNameDecorate,
    'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
    'cordova plugin add cordova-plugin-whitelist@1.3.1',
    'cordova plugin add cordova-plugin-inappbrowser@1.6.1',
    'cordova plugin add cordova-plugin-appavailability@0.4.2',
    'cordova plugin add cordova-plugin-file@4.3.1'
]));

gulp.task('patch', function() {
    return gulp.src(patchFolder + '/LoginActivity.java', { base: patchFolder + '/' })
        .pipe(gulp.dest('platforms/android/src/org/apache/cordova/qlogin/', { overwrite: true }));
});

gulp.task('copyAndroidImages', function() {
    return gulp.src('Images/Launch_icon/android/**/*', { base: 'Images/Launch_icon/android/' })
        .pipe(gulp.dest('platforms/android/res/', { overwrite: true }));
});

gulp.task('copyIOSImages', function() {
    return gulp.src('Images/Launch_icon/iOS/AppIcon.appiconset/*')
        .pipe(gulp.dest('platforms/ios/QPlay/Images.xcassets/AppIcon.appiconset/', { overwrite: true }));
});

gulp.task('copyIOSLaunchImages', function() {
    return gulp.src('../component/LaunchImage.launchimage/*')
        .pipe(gulp.dest('platforms/ios/QPlay/Images.xcassets/LaunchImage.launchimage/', { overwrite: true }));
});

gulp.task('build', shell.task([
    'cordova build ios --debug --device --buildConfig=build.json',
]))

gulp.task('componentCSS', function() {
    return gulp.src('../component/css/*.css')
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

gulp.task('libJS', function() {
    return gulp.src('../component/lib/*')
        .pipe(gulp.dest('www/js/lib/'));
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

gulp.task('commonString', function() {
    return gulp.src('../component/string/*')
        .pipe(gulp.dest('www/string/'));
});

gulp.task('String', ['commonString'], function() {
    return gulp.src('string/*')
        .pipe(gulp.dest('www/string/'));
});

gulp.task('componentJS', ['libJS', 'appJS', 'String'], shell.task([
    'rm ../component/function.js'
]));

//ex: gulp default --env test
gulp.task('default', ['patch', 'copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG', 'build'], function(){

});

gulp.task('jenkinsdefault', ['patch', 'copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG'], function(){

});
