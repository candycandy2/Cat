git checkout master

pwd
cd APP/NewQPlay
pwd

dailyver=$BUILD_NUMBER

# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop -m "v1.0.0.$dailyver[Develop]"
git push origin --tags

# ------ build QPlay ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp default --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

# cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1bf5dd25-17b1-466d-85f3-1bcc21371cfd" --developmentTeam="BenQ Corporation" --packageType="enterprise"
# cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1bf5dd25-17b1-466d-85f3-1bcc21371cfd" --packageType="enterprise"

# ------ build YellowPage ------
cd ../NewYellowPage
pwd
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="fd574cdf-cd7b-4349-9559-f0e07713dcc7" --packageType="enterprise"

# ------ build RRS ------
cd ../RRS
pwd
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="44988572-ef5e-401f-bc12-f5bd91958e1a" --packageType="enterprise"

# ------ build EIS ------
cd ../EIS
pwd
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="be22e920-9a9c-4b52-a484-f56724f40540" --packageType="enterprise"


# ------ make directory for apk and ipa ------
binfolder=~/Documents/QPlayDailyBuild/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/EIS.ipa $binfolder/EIS.ipa

# ------ copy source code ------
rm -Rf ~/Documents/QPlayDailyBuild/QPlayDailyBuild/
cp -R ~/.jenkins/workspace/QPlayDailyBuild ~/Documents/QPlayDailyBuild/QPlayDailyBuild/

# ------ copy file for mail attach ------
attachfolder=~/.jenkins/workspace/QPlayDailyBuild/1.0.0.$dailyver
mkdir $attachfolder
cp $binfolder/* $attachfolder

# ------ coomit modifind files ------
cd ..
pwd
git add NewQPlay/config.xml
git add NewYellowPage/config.xml
git add RRS/config.xml
git add EIS/config.xml
git commit -m "v1.0.0.$dailyver[Develop]"
git push
