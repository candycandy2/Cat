
//gulp pluegin
var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var shell = require('gulp-shell');
var env = require('gulp-env');
var minifyCSS = require('gulp-minify-css');

//Read parameter in command line
function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

//command line parameter
env.set({env: getArg("--env")});// pro=>Product, test=>QA, dev=>Develop
env.set({vname: getArg("--vname")});
env.set({vcode: getArg("--vcode")});

//Parameter for APP-Config & Install Cordova-plugin
env.set({appNameDecorate: ""});
env.set({appVersionDecorate: "Production"});
env.set({apiServerURL: "https://qplay.benq.com/"});
env.set({QPushAPPKey: "1dd3ebb8bb12f1895b4a5e25"});
env.set({patchFolder: "patch"});
env.set({productionextra: ""});

if (process.env.env === "test") {
    env.set({appNameDecorate: "test"});
    env.set({appVersionDecorate: "NewStaging"});
    env.set({apiServerURL: "https://qplaytest.benq.com/"});
    env.set({QPushAPPKey: "33938c8b001b601c1e647cbd"});
    env.set({patchFolder: "patchTest"});
} else if (process.env.env === "dev") {
    env.set({appNameDecorate: "dev"});
    env.set({appVersionDecorate: "Development"});
    env.set({apiServerURL: "https://qplaydev.benq.com/"});
    env.set({QPushAPPKey: "e343504d536ebce16b70167e"});
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
        //.pipe(concat('APP.css'))
        .pipe(concat('APP.min.css'))
        .pipe(minifyCSS({
          keepBreaks: false,
        }))
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

gulp.task('componentHTML', ['appHTML'], function() {
    fs.unlink('./template.html', (err) => {
    });
});

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
        //.pipe(concat('APP.js'))
        .pipe(uglify())
        .pipe(concat('APP.min.js'))
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

//Process Font
gulp.task('commonFont', function() {
    return gulp.src('../component/font/*')
        .pipe(gulp.dest('www/font/'));
});

gulp.task('Font', ['commonFont'], function() {
    return gulp.src('font/*')
        .pipe(gulp.dest('www/font/'));
});

gulp.task('componentJS', ['libJS', 'appJS', 'String', 'Font'], function() {
    fs.unlink('./function.js', (err) => {
    });
});
