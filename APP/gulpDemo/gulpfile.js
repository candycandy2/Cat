var gulp = require('gulp');

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
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('test', ['concat:js', 'concat:css'], function(){
	return gulp.src('src/index.html')
		.pipe(gulp.dest('dist'));
});
