git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+0))
echo "dailyver=$(($BUILD_NUMBER+0))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.Leave.Massage -m "v1.0.0.$dailyver[Product] Leave-Massage"
git push origin --tags

pwd
cd ../QPlayProduct-Leave-Massage/APP/Leave
pwd
# ------ build Leave Staging ------
gulp config --env test --vname 1.5.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="69051aba-01bb-4098-9a6b-de94bf560773" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/APP/Massage
pwd
# ------ build Massage Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="72df078b-2aee-4fa5-b845-95ddeca044c2" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/Production/Leave
pwd
# ------ build Leave Production ------
gulp config --vname 1.5.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="bafe9835-bf9d-473c-8f89-0c390601235a" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/Production/Massage
pwd
# ------ build Massage Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="62509b12-5538-4b46-89e6-392da17f90fe" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+0))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-Leave-Massage/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Leave-Massage/APP
cp $appfolder/Leave/platforms/android/build/outputs/apk/android-release.apk $binfolder/appleave.apk
cp $appfolder/Leave/platforms/iOS/build/device/Leave.ipa $binfolder/Leave.ipa
cp $appfolder/Massage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appmassage.apk
cp $appfolder/Massage/platforms/iOS/build/device/Massage.ipa $binfolder/Massage.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add Leave/config.xml
git add Massage/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] Leave-Massage"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-Leave-Massage/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Leave-Massage/Production
cp $appfolder/Leave/platforms/android/build/outputs/apk/android-release.apk $binfolder/appleave.apk
cp $appfolder/Leave/platforms/iOS/build/device/Leave.ipa $binfolder/Leave.ipa
cp $appfolder/Massage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appmassage.apk
cp $appfolder/Massage/platforms/iOS/build/device/Massage.ipa $binfolder/Massage.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-Leave-Massage/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-Leave-Massage ~/Documents/QPlayStaging-Leave-Massage/QPlayStaging/
