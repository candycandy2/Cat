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

env.set({APP_NAME: "ENS"});

var requireDir = require('require-dir');
var gulpTask = requireDir('../component/gulpTask/');

env.set({QPushAPPKey: "c96ae87b304de281b976d0ea"});
if (process.env.env === "test") {
    env.set({QPushAPPKey: "1c0c758b8329f982ce27c975"});
} else if (process.env.env === "dev") {
    env.set({QPushAPPKey: "6e51cf3c174910d247ac76f3"});
}

/*-----------------------------------------edit config.xml------------------------------------------*/
var schemeSetting = "<string>appqplay" + process.env.appNameDecorate + "</string><string>appens" + process.env.appNameDecorate + "</string>";

var configContent =   '<?xml version="1.0" encoding="utf-8"?>' +
                    '<widget id="com.qplay.appens' + process.env.appNameDecorate + '" android-versionCode="' + process.env.vcode + '" ios-CFBundleVersion="' + process.env.vcode + '" ' +
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
                        '<access origin="tel:*" launch-external="yes" />' +
                        '<allow-navigation href="*" />' +
                        '<allow-intent href="http://*/*" />' +
                        '<allow-intent href="https://*/*" />' +
                        '<allow-intent href="tel:*" />' +
                        '<allow-intent href="sms:*" />' +
                        '<allow-intent href="mailto:*" />' +
                        '<allow-intent href="geo:*" />' +
                        '<allow-intent href="appqplay' + process.env.appNameDecorate + ':*" />' +
                        '<allow-intent href="*:*" />' +
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
                        '<plugin name="cordova-connectivity-monitor" spec="~1.2.2" />' +
                    '</widget>';

//ex: gulp config --env test --vname 1.0.0.8 --vcode 8
gulp.task('config', function(){
    fs.writeFile('config.xml', configContent);
});

/*-------------------------------------------------------------------------------------------------*/
//ex: gulp install --env test
gulp.task('install', shell.task([
    /*
  'cordova plugin remove jpush-phonegap-plugin',
  'cordova plugin remove cordova-plugin-device',
  'cordova plugin remove cordova-plugin-app-update',
  'cordova plugin remove cordova-plugin-android-permissions',
  'cordova plugin remove cordova-plugin-customurlscheme',
  'cordova plugin remove cordova-plugin-qsecurity',
  'cordova plugin remove cordova-plugin-whitelist',
  'cordova plugin remove cordova-plugin-inappbrowser',
  'cordova plugin remove cordova-plugin-camera',
  'cordova plugin remove cordova-plugin-ios-camera-permissions',
  //'cordova plugin remove cordova-plugin-file',
  'cordova platform rm ios',
  'cordova platform rm android',
  */
  'cordova platform add ios',
  'cordova platform add android',
  'cordova plugin add cordova-plugin-device',
  'cordova plugin add ../../plugins/cordova-plugin-app-update',
  'cordova plugin add cordova-plugin-android-permissions',
  'cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=appens' + process.env.appNameDecorate,
  'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
  'cordova plugin add cordova-plugin-whitelist',
  'cordova plugin add cordova-plugin-inappbrowser',
  'cordova plugin add ../../plugins/cordova-plugin-camera',
  'cordova plugin add cordova-plugin-ios-camera-permissions --save',
  'cordova plugin add phonegap-plugin-mobile-accessibility',
  'cordova plugin add ../../plugins/jpush-phonegap-plugin --variable APP_KEY=' + process.env.QPushAPPKey
  //'cordova plugin add cordova-plugin-file'
]));

gulp.task('jenkinsinstall', shell.task([
  'cordova platform add ios',
  'cordova platform add android',
  'cordova plugin add ../../plugins/cordova-plugin-device',
  'cordova plugin add ../../plugins/cordova-plugin-app-update',
  'cordova plugin add ../../plugins/cordova-plugin-android-permissions',
  'cordova plugin add ../../plugins/cordova-plugin-customurlscheme --variable URL_SCHEME=appens' + process.env.appNameDecorate,
  'cordova plugin add ../../plugins/cordova-plugin-qsecurity --variable SCHEME_SETTING="' + schemeSetting + '"',
  'cordova plugin add ../../plugins/cordova-plugin-whitelist',
  'cordova plugin add ../../plugins/cordova-plugin-proguard',
  'cordova plugin add ../../plugins/cordova-plugin-inappbrowser',
  'cordova plugin add ../../plugins/cordova-plugin-camera',
  'cordova plugin add ../../plugins/cordova-plugin-ios-camera-permissions --save',
  'cordova plugin add ../../plugins/phonegap-plugin-mobile-accessibility',
  'cordova plugin add ../../plugins/jpush-phonegap-plugin --variable APP_KEY=' + process.env.QPushAPPKey
  //'cordova plugin add cordova-plugin-file@4.3.1'
]));

//ex: gulp default
gulp.task('default', ['copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG'], function(){

});

gulp.task('jenkinsdefault', ['copyAndroidImages', 'copyIOSImages', 'copyIOSLaunchImages', 'componentCSS', 'componentJS', 'componentHTML', 'componentIMG'], function(){

});
