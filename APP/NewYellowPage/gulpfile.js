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
//var copy = require('gulp-copy');

gulp.task('copy',function(){
    return gulp.src('Images/iOS/**/*', {base: 'Images/iOS/'})
        .pipe(gulp.dest('platforms/ios/YellowPage/Images.xcassets/',{overwrite: true}));
});

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
gulp.task('default', ['copy', 'componentCSS', 'componentJS'], function(){

});
