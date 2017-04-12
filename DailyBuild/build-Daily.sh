git checkout master
pwd

dailyver=$(($BUILD_NUMBER+167))
echo "dailyver=$(($BUILD_NUMBER+167))" > build.properties

# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop -m "v1.0.0.$dailyver[Develop]"
git push origin --tags

####################################
############# Multijob #############

pwd
cd ../QPlayDailyBuild-Multijob/APP/NewQPlay
pwd
# ------ build QPlay ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefaultwithbuild --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234

pwd
cd ../QPlayDailyBuild-Multijob/APP/NewYellowPage
pwd
# ------ build YellowPage ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="fd574cdf-cd7b-4349-9559-f0e07713dcc7" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Multijob/APP/RRS
pwd
# ------ build RRS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="64ae12f1-1cc3-45dc-9fc3-5ad7da41f655" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Multijob/APP/EIS
pwd
# ------ build EIS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="be22e920-9a9c-4b52-a484-f56724f40540" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Multijob/APP/ENS
pwd
# ------ build ENS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="3431f992-daa5-470e-a7cf-887d4aa1f7b0" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Multijob/APP/Relieve
pwd
# ------ build Relieve ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="7b45e617-8c2a-4909-8474-83aaad59fbb4" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Multijob/APP/AccountingRate
pwd
# ------ build AccountingRate ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="8042cdf3-ceae-43de-9226-3ef064ef98fc" --packageType="enterprise"

############# Multijob #############
####################################

# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+167))
binfolder=~/Documents/QPlayDailyBuild-Multijob/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-Multijob/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/EIS.ipa $binfolder/EIS.ipa
cp $appfolder/ENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/ENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/appaccountingrate.ipa $binfolder/AccountingRate.ipa

# ------ copy source code ------
rm -Rf ~/Documents/QPlayDailyBuild-Multijob/QPlayDailyBuild/
cp -R ~/.jenkins/workspace/QPlayDailyBuild-Multijob ~/Documents/QPlayDailyBuild-Multijob/QPlayDailyBuild/

# ------ coomit modifind files ------
cd APP
pwd
git pull
git add NewQPlay/config.xml
git add NewYellowPage/config.xml
git add RRS/config.xml
git add EIS/config.xml
git add ENS/config.xml
git add Relieve/config.xml
git add AccountingRate/config.xml
git commit -m "v1.0.0.$dailyver[Develop]"
git push

# ------ auto deploy ------
cd $binfolder

response=$(curl -X POST -F "userfile=@./appqplay.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appqplaydev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QPlay(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./appqplay.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appqplaydev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./appyellowpage.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appyellowpagedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy YellowPage(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./appyellowpage.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appyellowpagedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./apprrs.apk" -F "user_id=Samuel.Hsieh" -F "app_key=apprrsdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy RRS(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./apprrs.apk" -F "user_id=Samuel.Hsieh" -F "app_key=apprrsdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./appeis.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appeisdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy EIS(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./appeis.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appeisdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./appens.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appensdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy ENS(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./appens.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appensdev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./apprelieve.apk" -F "user_id=Samuel.Hsieh" -F "app_key=apprelievedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Relieve(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./apprelieve.apk" -F "user_id=Samuel.Hsieh" -F "app_key=apprelievedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./appaccountingrate.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appaccountingratedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy AccountingRate(android) fail!!! try again!!!"
    curl -X POST -F "userfile=@./appaccountingrate.apk" -F "user_id=Samuel.Hsieh" -F "app_key=appaccountingratedev" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

#curl -X POST -F 'userfile=@./QPlay.ipa' http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion

response=$(curl -X POST -F "userfile=@./YellowPage.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appyellowpagedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy YellowPage(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./YellowPage.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appyellowpagedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./RRS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=apprrsdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy RRS(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./RRS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=apprrsdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./EIS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appeisdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy EIS(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./EIS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appeisdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./ENS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appensdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy ENS(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./ENS.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appensdev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./Relieve.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=apprelievedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Relieve(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./Relieve.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=apprelievedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

response=$(curl -X POST -F "userfile=@./AccountingRate.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appaccountingratedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy AccountingRate(iOS) fail!!! try again!!!"
    curl -X POST -F "userfile=@./AccountingRate.ipa" -F "user_id=Samuel.Hsieh" -F "app_key=appaccountingratedev" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
