git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+0))
echo "dailyver=$(($BUILD_NUMBER+0))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.QisdaEIS-Parking -m "v1.0.0.$dailyver[Product] QisdaEIS-Parking"
git push origin --tags


pwd
cd ../QPlayProduct-QisdaEIS-Parking/APP/QisdaEIS
pwd
# ------ build QisdaEIS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="a2dd89a3-82a2-4b92-b4f9-4bc931470f80" --packageType="enterprise"

pwd
cd ../QPlayProduct-QisdaEIS-Parking/APP/Parking
pwd
# ------ build Parking Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="1c0ad2b9-3bdd-4267-8e4f-d6cef079756f" --packageType="enterprise"

pwd
cd ../QPlayProduct-QisdaEIS-Parking/Production/QisdaEIS
pwd
# ------ build QisdaEIS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="4d10caa8-3dda-4ccf-a342-808df0fc56c4" --packageType="enterprise"

pwd
cd ../QPlayProduct-QisdaEIS-Parking/Production/Parking
pwd
# ------ build Parking Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="03587ccc-3b77-4fc9-9d1d-1471ff00a5fd" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+0))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-QisdaEIS-Parking/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-QisdaEIS-Parking/APP
cp $appfolder/QisdaEIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqisdaeis.apk
cp $appfolder/QisdaEIS/platforms/iOS/build/device/QisdaEIS.ipa $binfolder/QisdaEIS.ipa
cp $appfolder/Parking/platforms/android/build/outputs/apk/android-release.apk $binfolder/appparking.apk
cp $appfolder/Parking/platforms/iOS/build/device/Parking.ipa $binfolder/Parking.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add QisdaEIS/config.xml
git add Parking/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] QisdaEIS-Parking"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-QisdaEIS-Parking/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-QisdaEIS-Parking/Production
cp $appfolder/QisdaEIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqisdaeis.apk
cp $appfolder/QisdaEIS/platforms/iOS/build/device/QisdaEIS.ipa $binfolder/QisdaEIS.ipa
cp $appfolder/Parking/platforms/android/build/outputs/apk/android-release.apk $binfolder/appparking.apk
cp $appfolder/Parking/platforms/iOS/build/device/Parking.ipa $binfolder/Parking.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-QisdaEIS-Parking/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-QisdaEIS-Parking ~/Documents/QPlayStaging-QisdaEIS-Parking/QPlayStaging/
