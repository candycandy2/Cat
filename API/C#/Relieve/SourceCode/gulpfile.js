var fs = require('fs');
var gulp = require('gulp');
var requireDir = require('require-dir');

var gulpTask = requireDir('../../../../APP/component/gulpTask/');

var infoContent = 'using System.Reflection;\n' +
                  'using System.Runtime.CompilerServices;\n' +
				  'using System.Runtime.InteropServices;\n' +
				  '// 有關程序即的常規訊息通過下列特性集控制。\n' +
				  '// 更改這些特性值可修改與程序集關連的訊息。\n' +
				  '[assembly: AssemblyTitle("RelieveWebService")]\n' +
				  '[assembly: AssemblyDescription("")]\n' +
				  '[assembly: AssemblyConfiguration("")]\n' +
				  '[assembly: AssemblyCompany("Sky123.Org")]\n' +
				  '[assembly: AssemblyProduct("RelieveWebService")]\n' +
				  '[assembly: AssemblyCopyright("版权所有(C) Sky123.Org 2016")]\n' +
				  '[assembly: AssemblyTrademark("")]\n' +
				  '[assembly: AssemblyCulture("")]\n' +
				  '// 將 ComVisible 設置為 false 會使程序集中的類型\n' +
				  '// 對 COM 組件不可見。如果需要從 COM 訪問此程序集中的某個類型，\n' +
				  '// 請針對該類型將 ComVisible 特性設置为 true。\n' +
				  '[assembly: ComVisible(false)]\n' +
				  '// 如果此项目向 COM 公开，则下列 GUID 用于类型库的 ID\n' +
				  '[assembly: Guid("066bebf0-e8d0-4f53-a490-7ff65ef9b486")]\n' +
				  '// 程序集的版本訊息由下列四個值組成:\n' +
				  '//\n' +
				  '//      主版本\n' +
				  '//      次版本\n' +
				  '//      内部版號号\n' +
				  '//      修訂號\n' +
				  '//\n' +
				  '// 可以指定所有這些值，也可以使用“修訂號”和“內部版本號”的默認值，\n' +
				  '// 方法是按如下所示使用“*”:\n' +
				  '[assembly: AssemblyVersion("' + process.env.vname + '")]\n' +
				  '[assembly: AssemblyFileVersion("' + process.env.vname + '")]';

//ex: gulp config --vname 1.0.0.1
gulp.task('config', function(){
	fs.writeFile('RelieveWebService/Properties/AssemblyInfo.cs', infoContent);
});
