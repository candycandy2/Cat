git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+350))
echo "dailyver=$(($BUILD_NUMBER+350))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.BenQEIS-ENS -m "v1.0.0.$dailyver[Product] BenQEIS-ENS"
git push origin --tags


pwd
cd ../QPlayProduct-EIS-ENS/APP/EIS
pwd
# ------ build EIS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="e818df9a-7f5b-4778-b054-19a536958ca4" --packageType="enterprise"

pwd
cd ../QPlayProduct-EIS-ENS/APP/ENS
pwd
# ------ build ENS Staging ------
gulp config --env test --vname 3.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
#cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
#cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2c40c205-767a-4412-be4d-c1cb522e681f" --packageType="enterprise"

pwd
cd ../QPlayProduct-EIS-ENS/Production/EIS
pwd
# ------ build EIS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="9bc36882-57c3-4ecf-a23f-5bfac67f9e33" --packageType="enterprise"

pwd
cd ../QPlayProduct-EIS-ENS/Production/ENS
pwd
# ------ build ENS Production ------
gulp config --vname 3.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
#cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
#cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c2cd923c-844d-433b-8596-6c522b5adaab" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+350))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-EIS-ENS/1.0.0.$dailyver
mkdir $binfolder

# move hear from BuildENS-Staging to prevent build fail
# ------ build ENS Staging ------
cd ~/.jenkins/workspace/QPlayProduct-EIS-ENS/APP/ENS
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2c40c205-767a-4412-be4d-c1cb522e681f" --packageType="enterprise"

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-EIS-ENS/APP
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appbenqeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/BenQEIS.ipa $binfolder/BenQEIS.ipa
cp $appfolder/ENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/ENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add EIS/config.xml
git add ENS/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] BenQEIS-ENS"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-EIS-ENS/1.0.0.$dailyver
mkdir $binfolder

# move hear from BuildENS-Production to precent build fail
# ------ build ENS Production ------
cd ~/.jenkins/workspace/QPlayProduct-EIS-ENS/Production/ENS
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c2cd923c-844d-433b-8596-6c522b5adaab" --packageType="enterprise"

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-EIS-ENS/Production
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appbenqeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/BenQEIS.ipa $binfolder/BenQEIS.ipa
cp $appfolder/ENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/ENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-EIS-ENS/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-EIS-ENS ~/Documents/QPlayStaging-EIS-ENS/QPlayStaging/
