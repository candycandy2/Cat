git checkout master

# ------ copy source code for building Production
cp -R APP Production

pwd
cd APP/NewQPlay
pwd

# dailyver=$BUILD_NUMBER
dailyver=$(($BUILD_NUMBER+200))

# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product -m "v1.0.0.$dailyver[Product]"
git push origin --tags


# ------  build QPlay Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

# ------ build YellowPage Staging ------
cd ../NewYellowPage
pwd
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="5e4f62e9-a983-4971-bb73-f83be5235c43" --packageType="enterprise"

# ------ build RRS Staging ------
cd ../RRS
pwd
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="148bd575-9e03-42cf-b5f3-ca50132226bd" --packageType="enterprise"

# make directory of Staging for apk and ipa
binfolder=~/Documents/QPlayStaging/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# ------ copy source code of Staging------
rm -Rf ~/Documents/QPlayStaging/QPlayStaging/
cp -R ~/.jenkins/workspace/QPlayProduct ~/Documents/QPlayStaging/QPlayStaging/



# ------ build QPlay Production ------
cd ../../Production/NewQPlay
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

# ------ build YellowPage Production ------
cd ../NewYellowPage
pwd
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="03d61647-a929-4b9f-8f10-325df7ae88f4" --packageType="enterprise"

# ------ build RRS Production ------
cd ../RRS
pwd
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp default
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="cf3b7828-ee64-4338-8e84-837e5f54367c" --packageType="enterprise"

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct/Production
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# ------ copy source code ------
rm -Rf ~/Documents/QPlayProduct/QPlayProduct/
cp -R ~/.jenkins/workspace/QPlayProduct ~/Documents/QPlayProduct/QPlayProduct/
