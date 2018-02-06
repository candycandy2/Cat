git checkout master
pwd
dailyver=$(($BUILD_NUMBER+540))
echo "dailyver=$(($BUILD_NUMBER+540))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop.Relieve-Leave-Parking -m "v1.0.0.$dailyver[Develop] Relieve-Leave-Parking"
git push origin --tags


pwd
cd ../QPlayDailyBuild-Relieve-Leave-Parking/APP/Relieve
pwd
# ------ build Relieve ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="addda671-c012-427b-834d-c15630cbb5bf" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Relieve-Leave-Parking/APP/Leave
pwd
# ------ build Leave ------
gulp config --env dev --vname 1.5.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="e6f796b2-ffb9-4ab7-bc0e-513f789056f8" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Relieve-Leave-Parking/APP/Parking
pwd
# ------ build Parking ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="4489068a-0bae-4593-b999-f340c2659339" --packageType="enterprise"


# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+540))
binfolder=~/Documents/QPlayDailyBuild-Relieve-Leave-Parking/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-Relieve-Leave-Parking/APP
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/Leave/platforms/android/build/outputs/apk/android-release.apk $binfolder/appleave.apk
cp $appfolder/Leave/platforms/iOS/build/device/Leave.ipa $binfolder/Leave.ipa
cp $appfolder/Parking/platforms/android/build/outputs/apk/android-release.apk $binfolder/appparking.apk
cp $appfolder/Parking/platforms/iOS/build/device/Parking.ipa $binfolder/Parking.ipa

# ------ copy source code ------
#rm -Rf ~/Documents/QPlayDailyBuild-Relieve-Leave-Parking/QPlayDailyBuild/
#cp -R ~/.jenkins/workspace/QPlayDailyBuild-Relieve-Leave-Parking ~/Documents/QPlayDailyBuild-Relieve-Leave-Parking/QPlayDailyBuild/

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add Relieve/config.xml
git add Leave/config.xml
git add Parking/config.xml
git commit -m "v1.0.0.$dailyver[Develop] Relieve-Leave-Parking"
git push

# ====== auto deploy start ======
cd $binfolder

# --- relieve android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "00a87a05c855809a0600388425c55f0b" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprelievedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./apprelieve.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Relieve(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprelievedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./apprelieve.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- leave android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "86883911af025422b626131ff932a4b5" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appleavedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appleave.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.5.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.5.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Leave(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appleavedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appleave.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.5.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.5.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- parking android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "eaf786afb27f567a9b04803e4127cef3" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appparkingdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appparking.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Parking(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appparkingdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appparking.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- relieve ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "00a87a05c855809a0600388425c55f0b" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprelievedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Relieve.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Relieve(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprelievedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Relieve.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- leave ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "86883911af025422b626131ff932a4b5" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appleavedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Leave.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.5.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.5.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Leave(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appleavedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Leave.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.5.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.5.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- parking ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "eaf786afb27f567a9b04803e4127cef3" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appparkingdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Parking.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Parking(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appparkingdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Parking.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
