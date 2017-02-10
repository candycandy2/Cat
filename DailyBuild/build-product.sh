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
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2953da8d-cd58-4d83-b2f9-90b93602b312" --packageType="enterprise"

# ------ build RRS Staging ------
cd ../RRS
pwd
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="afbbaf29-754b-44ac-9ddf-09c516c6d3d0" --packageType="enterprise"

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
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="a2ff443f-a7d0-49cd-947f-f621af2723ca" --packageType="enterprise"

# ------ build RRS Production ------
cd ../RRS
pwd
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
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

# ------ copy file for mail attach ------
#attachfolder=~/.jenkins/workspace/QPlayProduct/1.0.0.$dailyver
#mkdir $attachfolder
#cp $binfolder/* $attachfolder

# ------ commit modified files ------
#cd ..
#pwd
#git pull
#git add NewQPlay/config.xml
#git add NewYellowPage/config.xml
#git add RRS/config.xml
#git commit -m "v1.0.0.$dailyver[Product]"
#git push
