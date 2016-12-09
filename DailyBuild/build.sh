pwd
cd APP/NewQPlay
pwd

dailyver=34

gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

cd ../NewYellowPage
pwd
gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

cd ../RRS
pwd
gulp jenkinsinstall --env test
gulp --env test --vname 1.0.0.$dailyver --vcode $dailyver
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

binfolder=~/Documents/QPlayDailyBuild/1.0.0.$dailyver
mkdir $binfolder

appfolder=~/.jenkins/workspace/QPlayDailyBuild/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
