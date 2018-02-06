git checkout master
pwd
dailyver=$(($BUILD_NUMBER+430))
echo "dailyver=$(($BUILD_NUMBER+430))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Develop.QPlay-RRS-YP -m "v1.0.0.$dailyver[Develop] QPlay-RRS-YP"
git push origin --tags


pwd
cd ../QPlayDailyBuild-QPlay-RRS-YP/APP/NewQPlay
pwd
# ------ build QPlay ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="7f509ed0-6380-4839-bf49-5d51e9c27841" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-QPlay-RRS-YP/APP/RRS
pwd
# ------ build RRS ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="b013682f-a5fd-4dc8-adaa-217c1afac997" --packageType="enterprise"

pwd
cd ../QPlayDailyBuild-QPlay-RRS-YP/APP/NewYellowPage
pwd
# ------ build YellowPage ------
gulp config --env dev --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env dev
gulp jenkinsdefault --env dev
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="e85bfaa2-1ed5-4bc1-9f5f-f56363795ad4" --packageType="enterprise"


# ------ make directory for apk and ipa ------
dailyver=$(($BUILD_NUMBER+430))
binfolder=~/Documents/QPlayDailyBuild-QPlay-RRS-YP/1.0.0.$dailyver
mkdir $binfolder

# ------ copy apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayDailyBuild-QPlay-RRS-YP/APP
cp $appfolder/NewQPlay/platforms/android/build/outputs/apk/android-release.apk $binfolder/appqplay.apk
cp $appfolder/NewQPlay/platforms/iOS/build/device/QPlay.ipa $binfolder/QPlay.ipa
cp $appfolder/NewYellowPage/platforms/android/build/outputs/apk/android-release.apk $binfolder/appyellowpage.apk
cp $appfolder/NewYellowPage/platforms/iOS/build/device/YellowPage.ipa $binfolder/YellowPage.ipa
cp $appfolder/RRS/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprrs.apk
cp $appfolder/RRS/platforms/iOS/build/device/RRS.ipa $binfolder/RRS.ipa

# ------ copy source code ------
#rm -Rf ~/Documents/QPlayDailyBuild-QPlay-RRS-YP/QPlayDailyBuild/
#cp -R ~/.jenkins/workspace/QPlayDailyBuild-QPlay-RRS-YP ~/Documents/QPlayDailyBuild-QPlay-RRS-YP/QPlayDailyBuild/

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add NewQPlay/config.xml
git add NewYellowPage/config.xml
git add RRS/config.xml
git commit -m "v1.0.0.$dailyver[Develop] QPlay-RRS-YP"
git push

# ====== auto deploy start ======
cd $binfolder

# --- qplay android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "swexuc453refebraXecujeruBraqAc4e" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqplaydev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqplay.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QPlay(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqplaydev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appqplay.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- yellowpage android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "c103dd9568f8493187e02d4680e1bf2f" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appyellowpagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appyellowpage.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy YellowPage(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appyellowpagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./appyellowpage.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- rrs android ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "2e936812e205445490efb447da16ca13" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprrsdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./apprrs.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy RRS(android) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprrsdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./apprrs.apk" -F "user_id=Samuel.Hsieh" -F "device_type=android" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- qplay ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "swexuc453refebraXecujeruBraqAc4e" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqplaydev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QPlay.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy QPlay(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appqplaydev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./QPlay.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- yellowpage ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "c103dd9568f8493187e02d4680e1bf2f" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appyellowpagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./YellowPage.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy YellowPage(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: appyellowpagedev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./YellowPage.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi

# --- rrs ios ---
timestamp=$(date +%s)
mdbase64=$(printf $timestamp | openssl dgst -binary -sha256 -hmac "2e936812e205445490efb447da16ca13" | openssl base64)

response=$(curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprrsdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./RRS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion)
result=$(echo $response | jq '.ResultCode')
if [ $result != 1 ]; then
    echo "deploy RRS(iOS) fail!!! try again!!!"
    curl -H "Accept: application/json" -H "Content-Type: multipart/form-data" -H "App-Key: apprrsdev" -H "Signature-Time: $timestamp" -H "Signature: $mdbase64" -X POST -F "userfile=@./RRS.ipa" -F "user_id=Samuel.Hsieh" -F "device_type=ios" -F "version_name=v1.0.0.$dailyver[Develop]" -F "version_code=$dailyver" -F "version_log=v1.0.0.$dailyver[Develop]" http://qplaydev.benq.com/qplay/public/auto/uploadAppVersion
fi
