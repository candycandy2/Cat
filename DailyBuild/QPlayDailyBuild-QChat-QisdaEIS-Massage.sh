git checkout master
pwd
dailyver=$(($BUILD_NUMBER+2))
echo "dailyver=$(($BUILD_NUMBER+2))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop.QChat-QisdaEIS-Massage -m "v1.0.0.$dailyver[Develop] QChat-QisdaEIS-Massage"
git push origin --tags


pwd
cd ../QPlayDailyBuild-QChat-QisdaEIS-Massage/APP/QChat
pwd
# ------ build QChat ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="b3d804e2-3915-46ba-9a54-a53abe8651bb" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-QChat-QisdaEIS-Massage/APP/QisdaEIS
pwd
# ------ build QisdaEIS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="db758d9b-a0a0-4db5-9102-edfd9999fa31" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-QChat-QisdaEIS-Massage/APP/Massage
pwd
# ------ build Massage ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="515e7317-5d3b-476c-8475-a8af67ee294c" --packageType="enterprise"


# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+2))
binfolder=~/Documents/QPlayDailyBuild-QChat-QisdaEIS-Massage/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-QChat-QisdaEIS-Massage/APP
cp $appfolder/QChat/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqchat.apk
cp $appfolder/QChat/platforms/iOS/build/device/QChat.ipa $binfolder/QChat.ipa
cp $appfolder/QisdaEIS/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqisdaeis.apk
cp $appfolder/QisdaEIS/platforms/iOS/build/device/QisdaEIS.ipa $binfolder/QisdaEIS.ipa
cp $appfolder/Massage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appmassage.apk
cp $appfolder/Massage/platforms/iOS/build/device/Massage.ipa $binfolder/Massage.ipa

# ------ copy source code ------
#rm -Rf ~/Documents/QPlayDailyBuild-QChat-QisdaEIS-Massage/QPlayDailyBuild/
#cp -R ~/.jenkins/workspace/QPlayDailyBuild-QChat-QisdaEIS-Massage ~/Documents/QPlayDailyBuild-QChat-QisdaEIS-Massage/QPlayDailyBuild/

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add QChat/config.xml
git add QisdaEIS/config.xml
git add Massage/config.xml
git commit -m "v1.0.0.$dailyver[Develop] QChat-QisdaEIS-Massage"
git push

# ====== auto deploy start ======
cd $binfolder

# --- QChat android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "9f48f50f233f6ec48ffc4ae93d52a335" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqchatdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqchat.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QChat(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqchatdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqchat.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- QisdaEIS android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "b383e7bdeea5e91eb4223602a9df2f05" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqisdaeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqisdaeis.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QisdaEIS(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqisdaeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqisdaeis.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- Massage android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "7f341dd51f8492ca49278142343558d0" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appmassagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appmassage.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Massage(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appmassagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appmassage.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- QChat ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "9f48f50f233f6ec48ffc4ae93d52a335" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqchatdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QChat.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QChat(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqchatdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QChat.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- QisdaEIS ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "b383e7bdeea5e91eb4223602a9df2f05" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqisdaeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QisdaEIS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QisdaEIS(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqisdaeisdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QisdaEIS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- Massage ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "7f341dd51f8492ca49278142343558d0" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appmassagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Massage.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Massage(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appmassagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Massage.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
