////////////////////////////////////////
//Run
//By default gulpfile.js default
//=>gulp --appname AppName
////////////////////////////////////////

var gulp = require('gulp');
var shell = require('gulp-shell');
var env = require('gulp-env');

//Read parameter in command line
function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

//command line parameter
env.set({appname: getArg("--appname")});

//ex: gulp default
gulp.task('default', shell.task([
    'echo ====== cordova create task ======',
    'cordova create ' + process.env.appname,
    'echo ====== remove res ======',
    'rm -rf ' + process.env.appname + '/res',
    'echo ====== remove .npmignore ======',
    'rm ' + process.env.appname + '/.npmignore',
    'echo ====== copy to APP ======',
    'rsync -a ' + process.env.appname + ' ../App/',
    'echo ====== remove local app ======',
    'rm -rf ' + process.env.appname,
    'echo ====== copy gulpfile.js ======',
    'cp ../APP/CMSOP2/gulpfile.js ../APP/' + process.env.appname,
    'echo ====== copy build.json ======',
    'cp ../APP/CMSOP2/build.json ../APP/' + process.env.appname,
    'echo ====== copy string ======',
    'rsync -a ../APP/CMSOP4/string ../APP/' + process.env.appname,
    //'echo ====== copy Images ======',
    //'rsync -a ../APP/Default/Images ../APP/'+ process.env.appname,
    'echo ====== copy www ======',
    'rsync -a ../APP/CMSOP2/www ../APP/' + process.env.appname
]));
