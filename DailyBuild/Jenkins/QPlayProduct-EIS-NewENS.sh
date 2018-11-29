git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+350))
echo "dailyver=$(($BUILD_NUMBER+350))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.BenQEIS-NewENS -m "v1.0.0.$dailyver[Product] BenQEIS-NewENS"
git push origin --tags


pwd
cd ../QPlayProduct-EIS-NewENS/APP/EIS
pwd
# ------ build EIS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="e818df9a-7f5b-4778-b054-19a536958ca4" --packageType="enterprise"

pwd
cd ../QPlayProduct-EIS-NewENS/APP/NewENS
pwd
# ------ build NewENS Staging ------
gulp config --env test --vname 3.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="d59011ab-f4fd-4671-b60a-05df8ab01018" --packageType="enterprise"

pwd
cd ../QPlayProduct-EIS-NewENS/Production/EIS
pwd
# ------ build EIS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="9bc36882-57c3-4ecf-a23f-5bfac67f9e33" --packageType="enterprise"
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

pwd
cd ../QPlayProduct-EIS-NewENS/Production/NewENS
pwd
# ------ build NewENS Production ------
gulp config --vname 3.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="ea0ca5b9-542b-4a39-89ae-257329e7dab2" --packageType="enterprise"
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

dailyver=$(($BUILD_NUMBER+350))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-EIS-NewENS/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-EIS-NewENS/APP
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appbenqeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/BenQEIS.ipa $binfolder/BenQEIS.ipa
cp $appfolder/NewENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/NewENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add EIS/config.xml
git add NewENS/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] BenQEIS-NewENS"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-EIS-NewENS/1.0.0.$dailyver
mkdir $binfolder

# move hear from BuildENS-Production to precent build fail
# ------ build NewENS Production ------
cd ~/.jenkins/workspace/QPlayProduct-EIS-NewENS/Production/NewENS
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c2cd923c-844d-433b-8596-6c522b5adaab" --packageType="enterprise"

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-EIS-NewENS/Production
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appbenqeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/BenQEIS.ipa $binfolder/BenQEIS.ipa
cp $appfolder/NewENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/NewENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-EIS-NewENS/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-EIS-NewENS ~/Documents/QPlayStaging-EIS-NewENS/QPlayStaging/
