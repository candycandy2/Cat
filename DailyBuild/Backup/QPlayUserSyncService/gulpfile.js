var fs = require('fs');
var gulp = require('gulp');
var requireDir = require('require-dir');

var gulpTask = requireDir('../../../APP/component/gulpTask/');

var infoContent_JPushLogger =
          'using System.Reflection;\n' +
          'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '[assembly: AssemblyTitle("JPushLogger")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Microsoft")]\n' +
				  '[assembly: AssemblyProduct("JPushLogger")]\n' +
				  '[assembly: AssemblyCopyright("Copyright © Microsoft 2017")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '[assembly: Guid("feb23b05-ba8e-4dc9-87e7-1ee097f59b4f")]\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

var infoContent_JPushProxy =
          'using System.Reflection;\n' +
          'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '[assembly: AssemblyTitle("JPushProxy")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Microsoft")]\n' +
				  '[assembly: AssemblyProduct("JPushProxy")]\n' +
				  '[assembly: AssemblyCopyright("Copyright © Microsoft 2017")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '[assembly: Guid("10e41747-ade1-4f21-a89f-6913768baae1")]\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

var infoContent_QPlayUserSyncService =
          'using System.Reflection;\n' +
          'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '[assembly: AssemblyTitle("FlowER_QPlay_User_Sync")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Microsoft")]\n' +
				  '[assembly: AssemblyProduct("FlowER_QPlay_User_Sync")]\n' +
				  '[assembly: AssemblyCopyright("Copyright © Microsoft 2016")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '[assembly: Guid("724d7b96-3f0a-4155-8a10-e33ca4537e24")]\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

var infoContent_RegisterQPlay2QMessage =
          'using System.Reflection;\n' +
          'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '[assembly: AssemblyTitle("RegisterQPlay2QMessage")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Qisda")]\n' +
				  '[assembly: AssemblyProduct("RegisterQPlay2QMessage")]\n' +
				  '[assembly: AssemblyCopyright("Copyright © Qisda 2017")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '[assembly: Guid("eefccb1e-7cd2-41d5-ae9c-b3b1507f95a8")]\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

var infoContent_SyncFromFlower =
          'using System.Reflection;\n' +
          'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '[assembly: AssemblyTitle("SyncFromFlower")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Qisda")]\n' +
				  '[assembly: AssemblyProduct("SyncFromFlower")]\n' +
				  '[assembly: AssemblyCopyright("Copyright © Qisda 2016")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '[assembly: Guid("d8b45e74-ffa4-4786-9cd7-7ffeb0b82cbc")]\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';


//ex: gulp config --vname 1.0.0.1
gulp.task('config_JPushLogger', function(){
	fs.writeFile('JPushLogger/Properties/AssemblyInfo.cs', infoContent_JPushLogger);
});

gulp.task('config_JPushProxy', function(){
	fs.writeFile('JPushProxy/Properties/AssemblyInfo.cs', infoContent_JPushProxy);
});

gulp.task('config_QPlayUserSyncService', function(){
	fs.writeFile('QPlayUserSyncService/Properties/AssemblyInfo.cs', infoContent_QPlayUserSyncService);
});

gulp.task('config_RegisterQPlay2QMessage', function(){
	fs.writeFile('RegisterQPlay2QMessage/Properties/AssemblyInfo.cs', infoContent_RegisterQPlay2QMessage);
});

gulp.task('config_SyncFromFlower', function(){
	fs.writeFile('SyncFromFlower/Properties/AssemblyInfo.cs', infoContent_SyncFromFlower);
});
