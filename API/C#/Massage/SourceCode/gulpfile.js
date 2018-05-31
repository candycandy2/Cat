var fs = require('fs');
var gulp = require('gulp');
var requireDir = require('require-dir');

var gulpTask = requireDir('../../../../APP/component/gulpTask/');

var infoContent = 'using System.Reflection;\n' +
                  'using System.Runtime.CompilerServices;\n' +
				          'using System.Runtime.InteropServices;\n' +
				          '[assembly: AssemblyTitle("MassageWebService")]\n' +
				          '[assembly: AssemblyDescription("")]\n' +
				          '[assembly: AssemblyConfiguration("")]\n' +
				          '[assembly: AssemblyCompany("")]\n' +
				          '[assembly: AssemblyProduct("MassageWebService")]\n' +
				          '[assembly: AssemblyCopyright("")]\n' +
				          '[assembly: AssemblyTrademark("")]\n' +
				          '[assembly: AssemblyCulture("")]\n' +
				          '[assembly: ComVisible(false)]\n' +
				          '[assembly: Guid("066bebf0-e8d0-4f53-a490-7ff65ef9b486")]\n' +
				          '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				          '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

//ex: gulp config --vname 1.0.0.1
gulp.task('config', function(){
	fs.writeFile('MassageWebService/Properties/AssemblyInfo.cs', infoContent);
});
