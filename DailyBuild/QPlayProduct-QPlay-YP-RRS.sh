git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+350))
echo "dailyver=$(($BUILD_NUMBER+350))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.YP-RRS -m "v1.0.0.$dailyver[Product] QPlay-YP-RRS"
git push origin --tags


pwd
cd ../QPlayProduct-QPlay-YP-RRS/APP/NewQPlay
pwd
# ------  build QPlay Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="6e63d87a-5cf9-42bd-958e-b2155a210059" --packageType="enterprise"

pwd
cd ../QPlayProduct-QPlay-YP-RRS/APP/NewYellowPage
pwd
# ------ build YellowPage Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="d547d74d-154e-4e68-bc4f-8b5504f5e8e9" --packageType="enterprise"

pwd
cd ../QPlayProduct-QPlay-YP-RRS/APP/RRS
pwd
# ------ build RRS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="0f701946-a5d4-42c0-b68d-b5a2830c7635" --packageType="enterprise"

pwd
cd ../QPlayProduct-QPlay-YP-RRS/Production/NewQPlay
pwd
# ------ build QPlay Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="4395e7cb-8825-4730-908b-570c06b89560" --packageType="enterprise"

pwd
cd ../QPlayProduct-QPlay-YP-RRS/Production/NewYellowPage
pwd
# ------ build YellowPage Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="d46fae8d-7949-4696-a376-18bd10ae63af" --packageType="enterprise"

pwd
cd ../QPlayProduct-QPlay-YP-RRS/Production/RRS
pwd
# ------ build RRS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1f91a07a-df9c-41d5-850d-9b34104caa8d" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+350))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-QPlay-YP-RRS/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-QPlay-YP-RRS/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewQPlay/platforms/iOS/build/device/QPlay.ipa $binfolder/QPlay.ipa
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add NewQPlay/config.xml
git add NewYellowPage/config.xml
git add RRS/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] QPlay-YP-RRS"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-QPlay-YP-RRS/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-QPlay-YP-RRS/Production
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewQPlay/platforms/iOS/build/device/QPlay.ipa $binfolder/QPlay.ipa
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-QPlay-YP-RRS/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-QPlay-YP-RRS ~/Documents/QPlayStaging-QPlay-YP-RRS/QPlayStaging/
