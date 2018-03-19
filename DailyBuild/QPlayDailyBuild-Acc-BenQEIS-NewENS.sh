git checkout master
pwd
dailyver=$(($BUILD_NUMBER+427))
echo "dailyver=$(($BUILD_NUMBER+427))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop.Acc-BenQEIS-NewENS -m "v1.0.0.$dailyver[Develop] Acc-BenQEIS-NewENS"
git push origin --tags


pwd
cd ../QPlayDailyBuild-Acc-BenQEIS-NewENS/APP/AccountingRate
pwd
# ------ build AccountingRate ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="024702c2-acb7-4fc5-a9c7-c5bc7dd7a6c3" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Acc-BenQEIS-NewENS/APP/EIS
pwd
# ------ build EIS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c4ef9ec8-7c43-446f-aa41-6b70479c6ea5" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Acc-BenQEIS-NewENS/APP/NewENS
pwd
# ------ build NewENS ------
gulp config --env dev --vname 3.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="f0cf2fcb-9819-42e8-a5da-431818a9eccf" --packageType="enterprise"


# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+427))
binfolder=~/Documents/QPlayDailyBuild-Acc-BenQEIS-NewENS/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-Acc-BenQEIS-NewENS/APP
cp $appfolder/EIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appbenqeis.apk
cp $appfolder/EIS/platforms/iOS/build/device/BenQEIS.ipa $binfolder/BenQEIS.ipa
cp $appfolder/NewENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
cp $appfolder/NewENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/Corp.Rate.ipa $binfolder/AccountingRate.ipa

# ------ copy source code ------
#rm -Rf ~/Documents/QPlayDailyBuild-Acc-BenQEIS-NewENS/QPlayDailyBuild/
#cp -R ~/.jenkins/workspace/QPlayDailyBuild-Acc-BenQEIS-NewENS ~/Documents/QPlayDailyBuild-Acc-BenQEIS-NewENS/QPlayDailyBuild/

# ------ commit modifind config files ------
cd $appfolder
pwd
git pull
git add EIS/config.xml
git add NewENS/config.xml
git add AccountingRate/config.xml
git commit -m "v1.0.0.$dailyver[Develop] Acc-EIS-NewENS"
git push

# ====== auto deploy start ======
cd $binfolder

# --- eis android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "af8973de05c940f98a2c5e20b2ba649b" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appbenqeis.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy EIS(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appbenqeis.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- accounoting rate android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "35ee8716067626e225d38b9a97ee49f8" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appaccountingratedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appaccountingrate.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy AccountingRate(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appaccountingratedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appaccountingrate.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- eis ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "af8973de05c940f98a2c5e20b2ba649b" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./BenQEIS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy EIS(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./BenQEIS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- accounting rate ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "35ee8716067626e225d38b9a97ee49f8" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appaccountingratedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./AccountingRate.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy AccountingRate(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appaccountingratedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./AccountingRate.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# to avoid ENS build fail, move ENS cordova build command out from BuildNewENS-Dev
#cd ~/.jenkins/workspace/QPlayDailyBuild-Acc-BenQEIS-NewENS/APP/NewENS
#cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
#cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="f0cf2fcb-9819-42e8-a5da-431818a9eccf" --packageType="enterprise"
#cp $appfolder/NewENS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appens.apk
#cp $appfolder/NewENS/platforms/iOS/build/device/ENS.ipa $binfolder/ENS.ipa

cd $binfolder
# --- ens android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "dd88f6e1eea34e77a9ab75439d327363" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appensdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appens.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v3.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v3.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy ENS(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appensdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appens.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v3.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v3.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- ens ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "dd88f6e1eea34e77a9ab75439d327363" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appensdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./ENS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v3.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v3.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy ENS(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appensdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./ENS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v3.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v3.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
