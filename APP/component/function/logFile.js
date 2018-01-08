/************************************************************************************************/
/***************************************** Log File  ********************************************/
/************************************************************************************************/

var LogFile = {
    onErrorLoadFile: function(error) {
        //console.log("file system load error！");
    },
    onErrorCreateFile: function(error) {
        //console.log("file create error！");
    },
    onErrorReadFile: function(error) {
        //console.log("file load error!");;
    },
    onErrorRemoveFile: function(error) {
        //console.log("file remove error!");;
    },
    checkOldFile: function() {
        //check if The month before last was exist or not,
        //if exist, delete it.
        //ex: now is 2017/03, if 2017/01 exist, delete it, only remian 2017/03, 2017/02
        var nowDate = new Date();
        //var old = nowDate.setMonth(nowDate.getMonth() - 2);
        var old = nowDate.setMonth(nowDate.getMonth());
        var oldDate = new Date(old);
        var oldFile = oldDate.yyyymm("");

        this.removeFile(oldFile);
    },
    createAndWriteFile: function(dataArr) {
        //dataArr
        //[0]: Action
        //[1]: API
        //[2]: Log

        //persistent data stored
        /*
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (file) {

            //console.log('open file: ' + file.name);
            file.root.getFile(logFileName + ".json", { create: true, exclusive: false }, function (fileEntry) {

                //console.log("is file？" + fileEntry.isFile.toString());
                // fileEntry.name == 'hangge.txt'
                // fileEntry.fullPath == '/hangge.txt'

                LogFile.readFile(fileEntry, dataArr, true);

            }, LogFile.onErrorCreateFile);

        }, LogFile.onErrorLoadFile);
        */
    },
    writeFile: function(fileEntry, dataObj, isAppend) {
        fileEntry.createWriter(function(fileWriter) {
            //write success
            fileWriter.onwriteend = function() {
                //console.log("Successful file read...");
            };

            //write fail
            fileWriter.onerror = function(e) {
                //console.log("Failed file read: " + e.toString());
            };

            // If we are appending data to file, go to the end of the file.
            /*
            if (isAppend) {
                try {
                    fileWriter.seek(fileWriter.length);
                }
                catch (e) {
                    console.log("file doesn't exist!");
                }
            }
            */
            fileWriter.write(dataObj);
        });
    },
    readFile: function(fileEntry, dataArr, isAppend) {

        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                //console.log("Successful file read: ");
                //console.log(this.result);
                //console.log(fileEntry.fullPath);

                //new data content
                var nowDate = new Date();
                var nowTimestamp = nowDate.getTime().toString();

                if (this.result.length === 0) {
                    //data is empty
                    var logObj = {};

                    logObj[nowTimestamp] = {
                        "Action": dataArr[0],
                        "API": dataArr[1],
                        "Log": dataArr[2]
                    }
                } else {
                    //data is not empty
                    var resultData = LogFile.logDataFormat(this.result);
                    var logObj = JSON.parse(resultData);

                    logObj[nowTimestamp] = {
                        "Action": dataArr[0].toString(),
                        "API": dataArr[1].toString(),
                        "Log": dataArr[2].toString()
                    }
                }
                //console.log(logObj);
                var logJSON = JSON.stringify(logObj);
                //console.log(logJSON);

                //new log content
                var dataObj = new Blob([logJSON], { type: 'text/plain' });

                //write into file
                LogFile.writeFile(fileEntry, dataObj, true);
            };

            reader.readAsText(file);

        }, LogFile.onErrorReadFile);
    },
    removeFile: function(fileName) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(file) {
            file.root.getFile(fileName + "json", { create: false }, function(fileEntry) {
                fileEntry.remove(function(file) {
                    console.log("File removed!");
                }, function() {
                    console.log("error of deleting the file: " + error.code);
                }, function() {
                    console.log("file does not exist");
                });
            }, LogFile.onErrorRemoveFile);
        }, LogFile.onErrorLoadFile);
    },
    logDataFormat: function(dataStr) {
        //return dataStr + "\n";
        var tempDataTrim = dataStr.trim();
        var tempDataLastChar = tempDataTrim.substring(parseInt(tempDataTrim.length - 1, 10));
        var jsonData = dataStr;

        if (tempDataLastChar === ",") {
            var tempData = tempDataTrim.substring(0, parseInt(tempDataTrim.length - 1, 10));
            jsonData = tempData + "}";
        }

        return jsonData;
    }
};