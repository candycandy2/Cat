////////////////////////////////////////
//Install
//windows =>npm install -g gulp
//mac =>sudo npm install -g gulp
//=>npm install --save-dev gulp
//=>npm install gulp-concat gulp-less gulp-uglify
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


gulp.task('less',function(){
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css/'));
});

gulp.task('concat:css', ['less'], function(){
    return gulp.src('src/css/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('concat:js', function(){
    return gulp.src(['src/js/config.js','src/js/hello.js','src/js/main.js'])
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['concat:js', 'concat:css'], function(){
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});
