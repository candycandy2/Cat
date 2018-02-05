git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+0))
echo "dailyver=$(($BUILD_NUMBER+0))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.Activities.Insurance -m "v1.0.0.$dailyver[Product] Activities-Insurance"
git push origin --tags


pwd
cd ../QPlayProduct-Activities-Insurance/APP/Activities
pwd
# ------ build Activities Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="ad5126c7-1c13-4ee6-94b3-b0676f8af6e7" --packageType="enterprise"

pwd
cd ../QPlayProduct-Activities-Insurance/APP/Insurance
pwd
# ------ build Insurance Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="a3c5176c-8d82-476a-9d95-725a36e1f11f" --packageType="enterprise"

pwd
cd ../QPlayProduct-Activities-Insurance/Production/Activities
pwd
# ------ build Activities Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="dbb40afd-feff-42ac-a973-9246dce4f93c" --packageType="enterprise"

pwd
cd ../QPlayProduct-Activities-Insurance/Production/Insurance
pwd
# ------ build Insurance Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="195cf1d5-e216-497c-b54f-773f5ff59971" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+0))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-Activities-Insurance/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Activities-Insurance/APP
cp $appfolder/Activities/platforms/android/build/outputs/apk/android-release.apk $binfolder/appactivities.apk
cp $appfolder/Activities/platforms/iOS/build/device/Activities.ipa $binfolder/Activities.ipa
cp $appfolder/Insurance/platforms/android/build/outputs/apk/android-release.apk $binfolder/appinsurance.apk
cp $appfolder/Insurance/platforms/iOS/build/device/Insurance.ipa $binfolder/Insurance.ipa

# ------ coomit modified files ------
cd $appfolder
pwd
git pull
git add Activities/config.xml
git add Insurance/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] Activities-Insurance"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-Activities-Insurance/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Activities-Insurance/Production
cp $appfolder/Activities/platforms/android/build/outputs/apk/android-release.apk $binfolder/appactivities.apk
cp $appfolder/Activities/platforms/iOS/build/device/Activities.ipa $binfolder/Activities.ipa
cp $appfolder/Insurance/platforms/android/build/outputs/apk/android-release.apk $binfolder/appinsurance.apk
cp $appfolder/Insurance/platforms/iOS/build/device/Insurance.ipa $binfolder/Insurance.ipa

# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-Activities-Insurance/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-Activities-Insurance ~/Documents/QPlayStaging-Activities-Insurance/QPlayStaging/
