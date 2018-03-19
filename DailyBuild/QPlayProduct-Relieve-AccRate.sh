git checkout master
# ------ copy source code for building Production
cp -R APP Production
pwd
dailyver=$(($BUILD_NUMBER+350))
echo "dailyver=$(($BUILD_NUMBER+350))" > build.properties
# ------ add release tag ------
git tag -a v1.0.0.$dailyver.Product.Relieve-AccRate -m "v1.0.0.$dailyver[Product] Relieve-AccRate"
git push origin --tags


pwd
cd ../QPlayProduct-Relieve-AccRate/APP/Relieve
pwd
# ------ build Relieve Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="4262d647-bfed-43a4-9f43-0cfde2ec7cc0" --packageType="enterprise"

pwd
cd ../QPlayProduct-Relieve-AccRate/APP/AccountingRate
pwd
# ------ build AccountingRate Staging ------
gulp config --env test --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall --env test
gulp jenkinsdefault --env test
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="2c245ef5-f1d7-4e73-97e0-e3f180e6f9e3" --packageType="enterprise"

pwd
cd ../QPlayProduct-Relieve-AccRate/Production/Relieve
pwd
# ------ build Relieve Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="b211acee-7b3a-40ed-abcc-a13bb02a9a12" --packageType="enterprise"

pwd
cd ../QPlayProduct-Relieve-AccRate/Production/AccountingRate
pwd
# ------ build AccountingRate Production ------
gulp config --vname 1.0.0.$dailyver --vcode $dailyver
gulp jenkinsinstall
gulp jenkinsdefault
cordova build android --release -- --keystore=~/keystores/android.jks --storePassword=BenQ1234 --alias=QPlayAndroidKey --password=BenQ1234
cordova build ios --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="eb8327cb-f907-479d-a7fa-48da368ce2f0" --packageType="enterprise"


dailyver=$(($BUILD_NUMBER+350))

# ------ make directory of Staging for apk and ipa ------
binfolder=~/Documents/QPlayStaging-Relieve-AccRate/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Staging apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Relieve-AccRate/APP
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/Corp.Rate.ipa $binfolder/AccountingRate.ipa

# ------ commit modified config files ------
cd $appfolder
pwd
git pull
git add Relieve/config.xml
git add AccountingRate/config.xml
git commit -m "v1.0.0.$dailyver[Staging/Product] Relieve-AccRate"
git push

# ------ make directory of Production for apk and ipa ------
binfolder=~/Documents/QPlayProduct-Relieve-AccRate/1.0.0.$dailyver
mkdir $binfolder

# ------ copy Production apk and ipa ------
appfolder=~/.jenkins/workspace/QPlayProduct-Relieve-AccRate/Production
cp $appfolder/Relieve/platforms/android/build/outputs/apk/android-release.apk $binfolder/apprelieve.apk
cp $appfolder/Relieve/platforms/iOS/build/device/Relieve.ipa $binfolder/Relieve.ipa
cp $appfolder/AccountingRate/platforms/android/build/outputs/apk/android-release.apk $binfolder/appaccountingrate.apk
cp $appfolder/AccountingRate/platforms/iOS/build/device/Corp.Rate.ipa $binfolder/AccountingRate.ipa


# ------ copy source code of Staging------
#rm -Rf ~/Documents/QPlayStaging-Relieve-AccRate/QPlayStaging/
#cp -R ~/.jenkins/workspace/QPlayProduct-Relieve-AccRate ~/Documents/QPlayStaging-Relieve-AccRate/QPlayStaging/
