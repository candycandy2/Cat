git checkout master

# ------ copy source code for building Production
cp -R APP Production

pwd

dailyver=$(($BUILD_NUMBER+300))
echo "dailyver=$(($BUILD_NUMBER+300))" > build.properties

# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product -m "v1.0.0.$dailyver[Product]"
git push origin --tags

####################################
############# Multijob #############

pwd
cd ../QPlayProduct-Multijob/APP/NewQPlay
pwd
# ------  build QPlay Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefaultwithbuild --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

pwd
cd ../QPlayProduct-Multijob/APP/NewYellowPage
pwd
# ------ build YellowPage Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2953da8d-cd58-4d83-b2f9-90b93602b312" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/APP/RRS
pwd
# ------ build RRS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="afbbaf29-754b-44ac-9ddf-09c516c6d3d0" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/APP/EIS
pwd
# ------ build EIS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="acdc133e-f07e-44b0-a8a3-4ef8476ab556" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/APP/ENS
pwd
# ------ build ENS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="ad4712a0-4c61-4763-9a73-376c09e5fa53" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/APP/Relieve
pwd
# ------ build Relieve Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2c55a708-4e9a-4eba-ba4e-d6874f49907c" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/APP/AccountingRate
pwd
# ------ build AccountingRate Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="7c0aeb3e-9fb3-4475-a664-1e522c3ddd28" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/APP/Leave
pwd
# ------ build Leave Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="83909121-a65b-41aa-ace0-fd7d8c118428" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/APP/Massage
pwd
# ------ build Massage Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="9ce8a6ef-6886-4b98-b231-dbe8bdaed850" --packageType="enterprise"

pwd
cd ../QPlayProduct-QisdaEIS/APP/QisdaEIS
pwd
# ------ build QisdaEIS Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="a2dd89a3-82a2-4b92-b4f9-4bc931470f80" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/NewQPlay
pwd
# ------ build QPlay Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefaultwithbuild
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

pwd
cd ../QPlayProduct-Multijob/Production/NewYellowPage
pwd
# ------ build YellowPage Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="a2ff443f-a7d0-49cd-947f-f621af2723ca" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/RRS
pwd
# ------ build RRS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="cf3b7828-ee64-4338-8e84-837e5f54367c" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/EIS
pwd
# ------ build EIS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="9806e113-e8f5-468f-bd2d-2b8aff1acca7" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/ENS
pwd
# ------ build ENS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="b137e8ef-e6ba-4470-a2ad-c6982816a200" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/Relieve
pwd
# ------ build Relieve Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c7562e87-ca38-410a-9391-1a260ff70cd9" --packageType="enterprise"

pwd
cd ../QPlayProduct-Multijob/Production/AccountingRate
pwd
# ------ build AccountingRate Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="dfd41448-4fda-482c-ba00-b8df8584e734" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/Production/Leave
pwd
# ------ build Leave Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="b0b850d4-b642-460f-a749-fdcbb0839fea" --packageType="enterprise"

pwd
cd ../QPlayProduct-Leave-Massage/Production/Massage
pwd
# ------ build Massage Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="7c735ea8-86d9-4285-a8e8-08c520a3433c" --packageType="enterprise"

pwd
cd ../QPlayProduct-QisdaEIS/Production/QisdaEIS
pwd
# ------ build QisdaEIS Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="4d10caa8-3dda-4ccf-a342-808df0fc56c4" --packageType="enterprise"


############# Multijob #############
####################################

dailyver=$(($BUILD_NUMBER+300))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Multijob/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/EIS.ipa $binfolder/EIS.ipa
cp $appfolder/ENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/ENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/Acct.Rate.ipa $binfolder/AccountingRate.ipa
cp $appfolder/Leave/platforms/android/build/outputs/apk/android-release.apk $binfolder/appleave.apk
cp $appfolder/Leave/platforms/iOS/build/device/Leave.ipa $binfolder/Leave.ipa
cp $appfolder/Massage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appmassage.apk
cp $appfolder/Massage/platforms/iOS/build/device/Massage.ipa $binfolder/Massage.ipa
cp $appfolder/QisdaEIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqisdaeis.apk
cp $appfolder/QisdaEIS/platforms/iOS/build/device/QisdaEIS.ipa $binfolder/QisdaEIS.ipa

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Multijob/Production
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/EIS.ipa $binfolder/EIS.ipa
cp $appfolder/ENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/ENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/Acct.Rate.ipa $binfolder/AccountingRate.ipa
cp $appfolder/Leave/platforms/android/build/outputs/apk/android-release.apk $binfolder/appleave.apk
cp $appfolder/Leave/platforms/iOS/build/device/Leave.ipa $binfolder/Leave.ipa
cp $appfolder/Massage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appmassage.apk
cp $appfolder/Massage/platforms/iOS/build/device/Massage.ipa $binfolder/Massage.ipa
cp $appfolder/QisdaEIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqisdaeis.apk
cp $appfolder/QisdaEIS/platforms/iOS/build/device/QisdaEIS.ipa $binfolder/QisdaEIS.ipa

# ------ copy source code of Staging------
rm -Rf ~/Documents/QPlayStaging/QPlayStaging/
cp -R ~/.jenkins/workspace/QPlayProduct-Multijob ~/Documents/QPlayStaging/QPlayStaging/

# ------ copy source code of Production ------
rm -Rf ~/Documents/QPlayProduct/QPlayProduct/
cp -R ~/.jenkins/workspace/QPlayProduct-Multijob ~/Documents/QPlayProduct/QPlayProduct/

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
