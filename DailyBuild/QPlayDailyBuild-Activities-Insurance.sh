git checkout master
pwd
dailyver=$(($BUILD_NUMBER+0))
echo "dailyver=$(($BUILD_NUMBER+0))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop.Activities-Insurance -m "v1.0.0.$dailyver[Develop] Activities-Insurance"
git push origin --tags


pwd
cd ../QPlayDailyBuild-Activities-Insurance/APP/Activities
pwd
# ------ build Activities ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
opencc -c t2s.json -i string/zh-tw.json -o string/zh-cn.json
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="f8cfd2f0-2aff-4f6e-8429-dda7301f7692" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-Activities-Insurance/APP/Insurance
pwd
# ------ build Insurance ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="090dd658-52e5-41fa-869a-d68672dbfa4e" --packageType="enterprise"


# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+0))
binfolder=~/Documents/QPlayDailyBuild-Activities-Insurance/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-Activities-Insurance/APP
cp $appfolder/Activities/platforms/android/build/outputs/apk/android-release.apk $binfolder/appactivities.apk
cp $appfolder/Activities/platforms/iOS/build/device/Activities.ipa $binfolder/Activities.ipa
cp $appfolder/Insurance/platforms/android/build/outputs/apk/android-release.apk $binfolder/appinsurance.apk
cp $appfolder/Insurance/platforms/iOS/build/device/Insurance.ipa $binfolder/Insurance.ipa

# ------ copy source code ------
#rm -Rf ~/Documents/QPlayDailyBuild-Activities-Insurance/QPlayDailyBuild/
#cp -R ~/.jenkins/workspace/QPlayDailyBuild-Activities-Insurance ~/Documents/QPlayDailyBuild-Activities-Insurance/QPlayDailyBuild/

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add Activities/config.xml
git add Insurance/config.xml
git commit -m "v1.0.0.$dailyver[Develop] Activities-Insurance"
git push

# ====== auto deploy start ======
cd $binfolder

# --- Activities android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "b1580f5dcdef21cf35993f1310edf511" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appactivitiesdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appactivities.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Activities(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appactivitiesdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appactivities.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- Insurance android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "e85c0c548016c12b5ef56244067ab616" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appinsurancedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appinsurance.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Insurance(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appinsurancedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appinsurance.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- Activities ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "b1580f5dcdef21cf35993f1310edf511" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appactivitiesdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Activities.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Activities(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appactivitiesdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Activities.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- Insurance ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "e85c0c548016c12b5ef56244067ab616" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appinsurancedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Insurance.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy Insurance(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appinsurancedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./Insurance.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
