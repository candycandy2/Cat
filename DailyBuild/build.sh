git checkout master

pwd
cd APP/NewQPlay
pwd

dailyver=$BUILD_NUMBER

# build QPlay
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

# cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1bf5dd25-17b1-466d-85f3-1bcc21371cfd" --developmentTeam="BenQ Corporation" --packageType="enterprise"
# cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1bf5dd25-17b1-466d-85f3-1bcc21371cfd" --packageType="enterprise"

# build YellowPage
cd ../NewYellowPage
pwd
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1e399119-b682-47ab-bda9-7d05afc3e7a7" --packageType="enterprise"

# build RRS
cd ../RRS
pwd
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="90a31619-a2f6-46c8-a64f-7e4be29744d0" --packageType="enterprise"

# make directory for apk and ipa
binfolder=~/Documents/QPlayDailyBuild/1.0.0.$dailyver
mkdir $binfolder

# copy apk and ipa
appfolder=~/.jenkins/workspace/QPlayDailyBuild/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# coomit modified files
cd ..
pwd
git add NewQPlay/config.xml
git add NewYellowPage/config.xml
git add RRS/config.xml
git commit -m "v1.0.0.$dailyver[NewStaging]"
git push

# add release tag
git tag -a v1.0.0.$dailyver -m "v1.0.0.$dailyver[NewStaging]"
git push origin --tags

# copy source code
rm -Rf ~/Documents/QPlayDailyBuild/QPlayDailyBuild/
cp -R ~/.jenkins/workspace/QPlayDailyBuild ~/Documents/QPlayDailyBuild/QPlayDailyBuild/
