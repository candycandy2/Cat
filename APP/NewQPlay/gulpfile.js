////////////////////////////////////////
//Install
//windows =>npm install -g gulp
//mac =>sudo npm install -g gulp
//=>npm install --save-dev gulp
//=>npm install gulp-concat gulp-less gulp-uglify gulp-copy
//=>npm i --save-dev gulp-env
//=>npm install require-dir
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
var shell = require('gulp-shell');
var env = require('gulp-env');

env.set({APP_NAME: "QPlay"});

var requireDir = require('require-dir');
var gulpTask = requireDir('../component/gulpTask/');

/*-----------------------------------------edit config.xml------------------------------------------*/
var schemeSetting =   "<string>appqplay"    + process.env.appNameDecorate + "</string>"
                    + "<string>appyellowpage"+process.env.appNameDecorate + "</string>"
                    + "<string>appcalendar" + process.env.appNameDecorate + "</string>"
                    + "<string>apprrs"      + process.env.appNameDecorate + "</string>"
                    + "<string>appaccountingrate"+process.env.appNameDecorate + "</string>"
                    + "<string>appens"      + process.env.appNameDecorate + "</string>"
                    + "<string>appeis"      + process.env.appNameDecorate + "</string>"
                    + "<string>appleave"    + process.env.appNameDecorate + "</string>"
                    + "<string>apprelieve"  + process.env.appNameDecorate + "</string>"
                    + "<string>appmas"      + process.env.appNameDecorate + "</string>"
                    + "<string>appim"       + process.env.appNameDecorate + "</string>"
                    + "<string>appcm"       + process.env.appNameDecorate + "</string>"
                    + "<string>appeagle"    + process.env.appNameDecorate + "</string>"
                    + "<string>appbadminton"+ process.env.appNameDecorate + "</string>"
                    + "<string>appqisdaeis" + process.env.appNameDecorate + "</string>"
                    + "<string>appqchat"    + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme01" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme02" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme03" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme04" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme05" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme06" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme07" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme08" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme09" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme10" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme11" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme12" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme13" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme14" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme15" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme16" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme17" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme18" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme19" + process.env.appNameDecorate + "</string>"
                    + "<string>appscheme20" + process.env.appNameDecorate + "</string>";

var configContent =   '<?xml version="1.0" encoding="utf-8"?>' +
                    '<widget id="com.qplay.appqplay' + process.env.appNameDecorate + '" android-versionCode="' + process.env.vcode + '" ios-CFBundleVersion="' + process.env.vcode + '" ' +
                        'version="' + process.env.vname + '[' + process.env.appVersionDecorate + ']" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">' +
                        '<name>' + process.env.APP_NAME + '</name>' +
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
                        '<allow-intent href="appyellowpage'+process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="apprrs'      + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appeis'      + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appcalendar' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appens'      + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appaccountingrate'+process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appleave'    + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="apprelieve'  + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appmas'      + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appim'       + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appcm'       + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appeagle'    + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appbadminton'+ process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appqisdaeis' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appqchat'    + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme01' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme02' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme03' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme04' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme05' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme06' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme07' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme08' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme09' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme10' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme11' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme12' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme13' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme14' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme15' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme16' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme17' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme18' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme19' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="appscheme20' + process.env.appNameDecorate + ':*" />' +
                        '<platform name="android">' +
                            '<allow-intent href="market:*" />' +
                            '<preference name="AndroidLaunchMode" value="singleTask"/>' +
                            //'<preference name="AndroidPersistentFileLocation" value="Compatibility" />' +
                        '</platform>' +
                        '<platform name="ios">' +
                            '<hook type="before_compile" src="hooks/xcode8.js" />' +
                            '<allow-intent href="itms:*" />' +
                            '<allow-intent href="itms-apps:*" />' +
                            //'<preference name="iosPersistentFileLocation" value="Compatibility" />' +
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
    //'cordova plugin remove cordova-plugin-console',
    //'cordova plugin remove cordova-plugin-appversion',//depend on cordova-plugin-app-update
    'cordova plugin remove cordova-plugin-customurlscheme',
    'cordova plugin remove cordova-plugin-qsecurity',
    'cordova plugin remove cordova-plugin-app-update',
    'cordova plugin remove cordova-plugin-android-permissions',
    'cordova plugin remove cordova-plugin-whitelist',
    //'cordova plugin remove cordova-plugin-inappbrowser',
    'cordova plugin remove cordova-plugin-appavailability',
    //'cordova plugin remove cordova-plugin-file',
    'cordova platform rm ios',
    'cordova platform rm android',
    'cordova platform add ios',
    'cordova platform add android',
    'cordova plugin add ../../plugins/cordova-plugin-qlogin --variable LOGIN_URL=' + process.env.apiServerURL + 'qplayApi/public/qplayauth_register',
    'cordova plugin add ../../plugins/cordova-plugin-qpush --variable API_KEY=' + process.env.QPushAPPKey,
    'cordova plugin add cordova-plugin-device',
    //'cordova plugin add cordova-plugin-console',
    //'cordova plugin add cordova-plugin-appversion',
    'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appqplay' + process.env.appNameDecorate,
    'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
    'cordova plugin add ../../plugins/cordova-plugin-app-update',
    'cordova plugin add cordova-plugin-android-permissions',
    'cordova plugin add cordova-plugin-whitelist',
    //'cordova plugin add cordova-plugin-inappbrowser',
    'cordova plugin add cordova-plugin-appavailability'//,
    //'cordova plugin add cordova-plugin-file'
]));

gulp.task('jenkinsinstall', shell.task([
    'cordova platform add ios',
    'cordova platform add android',
    'cordova plugin add ../../plugins/cordova-plugin-qlogin --variable LOGIN_URL=' + process.env.apiServerURL + 'qplayApi/public/qplayauth_register',
    'cordova plugin add ../../plugins/cordova-plugin-qpush --variable API_KEY=' + process.env.QPushAPPKey,
    'cordova plugin add cordova-plugin-device@1.1.4',
    //'cordova plugin add cordova-plugin-console@1.0.5',
    //'cordova plugin add cordova-plugin-appversion',
    'cordova plugin add cordova-plugin-customurlscheme@4.2.0 --variable URL_SCHEME=appqplay' + process.env.appNameDecorate,
    'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
    'cordova plugin add ../../plugins/cordova-plugin-app-update',
    'cordova plugin add cordova-plugin-android-permissions',
    'cordova plugin add cordova-plugin-whitelist@1.3.1',
    'cordova plugin add cordova-plugin-appavailability@0.4.2',
    //'cordova plugin add cordova-plugin-file@4.3.1'
    'cordova plugin add ../../plugins/cordova-plugin-proguard'
]));

gulp.task('patch', function() {
    return gulp.src(process.env.patchFolder + '/LoginActivity.java', { base: process.env.patchFolder + '/' })
        .pipe(gulp.dest('platforms/android/src/org/apache/cordova/qlogin/', { overwrite: true }));
});

//ex: gulp default --env test
gulp.task('default', ['patch', 'copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG'], function(){

});

gulp.task('jenkinsdefault', ['patch', 'copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG'], function(){

});

gulp.task('jenkinsdefaultwithbuild', ['patch', 'copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG', 'build'], function(){

});
