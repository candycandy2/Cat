pwd
cd APP/NewQPlay
pwd

dailyver=32

gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android

cd ../NewYellowPage
pwd
gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android

cd ../RRS
pwd
gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android

binfolder=~/Documents/QPlayDailyBuild/1.0.0.$dailyver
mkdir $binfolder

appfolder=~/.jenkins/workspace/QPlayDailyBuild/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-debug.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-debug.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-debug.apk $binfolder/apprrs.apk
