
//gulp pluegin
var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var shell = require('gulp-shell');
var env = require('gulp-env');

//Read parameter in command line
function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

//command line parameter
//var env = getArg("--env");      // pro=>Product, test=>QA, dev=>Develop
env.set({env: getArg("--env")});
//var vname = getArg("--vname");
env.set({vname: getArg("--vname")});
//var vcode = getArg("--vcode");
env.set({vcode: getArg("--vcode")});

//Parameter for APP-Config & Install Cordova-plugin
//var appNameDecorate = "";
env.set({appNameDecorate: ""});
//var appVersionDecorate = "Production";
env.set({appVersionDecorate: "Production"});
//var apiServerURL = "https://qplay.benq.com/";
env.set({apiServerURL: "https://qplay.benq.com/"});
//var QPushAPPKey = "1dd3ebb8bb12f1895b4a5e25";
env.set({QPushAPPKey: "1dd3ebb8bb12f1895b4a5e25"});
//var patchFolder = "patch";
env.set({patchFolder: "patch"});
//var productionextra = ""; // production app id is com.qplay.apprelieve1
env.set({productionextra: ""});

if (process.env.env === "test") {
    //appNameDecorate = "test";
    env.set({appNameDecorate: "test"});
    //appVersionDecorate = "NewStaging";
    env.set({appVersionDecorate: "NewStaging"});
    //apiServerURL = "https://qplaytest.benq.com/";
    env.set({apiServerURL: "https://qplaytest.benq.com/"});
    //QPushAPPKey = "33938c8b001b601c1e647cbd";
    env.set({QPushAPPKey: "33938c8b001b601c1e647cbd"});
    //patchFolder = "patchTest";
    env.set({patchFolder: "patchTest"});
} else if (process.env.env === "dev") {
    //appNameDecorate = "dev";
    env.set({appNameDecorate: "dev"});
    //appVersionDecorate = "Development";
    env.set({appVersionDecorate: "Development"});
    //apiServerURL = "https://qplaydev.benq.com/";
    env.set({apiServerURL: "https://qplaydev.benq.com/"});
    //QPushAPPKey = "e343504d536ebce16b70167e";
    env.set({QPushAPPKey: "e343504d536ebce16b70167e"});
    //patchFolder = "patchDev";
    env.set({patchFolder: "patchDev"});
} else { 
    // production case
    env.set({productionextra: "1"});
}

//Common Task

//copy image for Android / iOS
gulp.task('copyAndroidImages', function() {
    return gulp.src('Images/Launch_icon/android/**/*', {base: 'Images/Launch_icon/android/'})
        .pipe(gulp.dest('platforms/android/res/',{overwrite: true}));
});

gulp.task('copyIOSImages', function() {
    return gulp.src('Images/Launch_icon/iOS/AppIcon.appiconset/*')
        .pipe(gulp.dest('platforms/ios/' + process.env.APP_NAME + '/Images.xcassets/AppIcon.appiconset/', { overwrite: true }));
});

gulp.task('copyIOSLaunchImages', function() {
    return gulp.src('../component/LaunchImage.launchimage/*')
        .pipe(gulp.dest('platforms/ios/' + process.env.APP_NAME + '/Images.xcassets/LaunchImage.launchimage/', { overwrite: true }));
});

//Bulid iOS
gulp.task('build', shell.task([
    'cordova build ios --debug --device --buildConfig=build.json',
]))

//Process CSS
gulp.task('appCSS', function(){
    return gulp.src(['../component/css/component.css','../component/css/template.css'])
        .pipe(concat('APP.css'))
        .pipe(gulp.dest('www/css/'));
});

gulp.task('componentCSS', ['appCSS'], function() {
    return gulp.src('../component/css/jquery.mobile-1.4.5.min.css')
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

//Process HTML template
gulp.task('templateHTML', function() {
    return gulp.src('../component/template/*.html')
        .pipe(concat('template.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('appHTML', ['templateHTML'], function(){
    return gulp.src(['../component/component.html','./template.html'])
        .pipe(concat('APP.html'))
        .pipe(gulp.dest('www/View/'));
});

gulp.task('componentHTML', ['appHTML'], shell.task([
    //'rm ./template.html'
]));

//Process Image
gulp.task('componentIMG', function() {
    return gulp.src('../component/image/*')
        .pipe(gulp.dest('www/img/component/'));
});

//Process JS
gulp.task('libJS', function() {
    return gulp.src('../component/lib/*')
        .pipe(gulp.dest('www/js/lib/'));
});

gulp.task('functionJS', function() {
    return gulp.src('../component/function/*.js')
        .pipe(concat('function.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('appJS', ['functionJS'], function(){
    return gulp.src(['../component/component.js','./function.js'])
        //.pipe(uglify())
        //.pipe(concat('app.min.js'))
        .pipe(concat('APP.js'))
        .pipe(gulp.dest('www/js/'));
});

//Process String
gulp.task('commonString', function() {
    return gulp.src('../component/string/*')
        .pipe(gulp.dest('www/string/'));
});

gulp.task('String', ['commonString'], function() {
    return gulp.src('string/*')
        .pipe(gulp.dest('www/string/'));
});

gulp.task('componentJS', ['libJS', 'appJS', 'String'], shell.task([
    //'rm ./function.js'
]));
