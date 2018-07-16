var fs = require('fs');
var gulp = require('gulp');
var requireDir = require('require-dir');

var gulpTask = requireDir('../../../../APP/component/gulpTask/');

var infoContent = 'using System.Reflection;\n' +
                  'using System.Runtime.CompilerServices;\n' +
				    		  'using System.Runtime.InteropServices;\n' +
				    		  '// General Information about an assembly is controlled through the following\n' +
				    		  '// set of attributes. Change these attribute values to modify the information\n' +
                  '// associated with an assembly.\n' +
				    		  '[assembly: AssemblyTitle("QPlay.Job.SyncGaiaUser")]\n' +
				    		  '[assembly: AssemblyDescription("")]\n' +
				    		  '[assembly: AssemblyConfiguration("")]\n' +
				    		  '[assembly: AssemblyCompany("Microsoft")]\n' +
				    		  '[assembly: AssemblyProduct("QPlay.Job.SyncGaiaUser")]\n' +
				    		  '[assembly: AssemblyCopyright("Copyright © Microsoft 2018")]\n' +
				    		  '[assembly: AssemblyTrademark("")]\n' +
				    		  '[assembly: AssemblyCulture("")]\n' +
				    		  '// Setting ComVisible to false makes the types in this assembly not visible\n' +
				    		  '// to COM components.  If you need to access a type in this assembly from\n' +
				    		  '// COM, set the ComVisible attribute to true on that type.\n' +
				    		  '[assembly: ComVisible(false)]\n' +
				    		  '// he following GUID is for the ID of the typelib if this project is exposed to COM\n' +
				    		  '[assembly: Guid("8355615e-f00d-43af-b380-4d7836f82474")]\n' +
				    		  '// Version information for an assembly consists of the following four values:\n' +
				    		  '//\n' +
				    		  '//      Major Version\n' +
				    		  '//      Minor Version\n' +
				    		  '//      Build Number\n' +
				    		  '//      Revision\n' +
				    		  '//\n' +
				    		  '// You can specify all the values or you can default the Build and Revision Numbers\n' +
				    		  '// by using the '*' as shown below:\n' +
                  '// [assembly: AssemblyVersion("1.0.*")]\n' +
				    		  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				    		  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]\n' +
                  '[assembly: log4net.Config.DOMConfigurator(ConfigFileExtension = "config", Watch = true)]';

//ex: gulp config --vname 1.0.0.1
gulp.task('config', function(){
	fs.writeFile('QPlay.Job.SyncGaiaUser/Properties/AssemblyInfo.cs', infoContent);
});
