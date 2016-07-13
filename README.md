# 企業運作平台
## 讓開發安全可靠好用的APP變得很容易

使用WEB為主要開發環境, 只要你會寫網頁, 就可以開發APP

### 開發完成的Plugin
1. [qsecurity-plugin](https://github.com/BenQdigiPages/EnterpriseAPPPlatform/wiki/qsecurity-plugin)

### 開發中Plugin
1. [qlogin-plugin](https://github.com/BenQdigiPages/EnterpriseAPPPlatform/wiki/qlogin-plugin)

目前運行版本, 更新的版本為驗證過, 請確認所有功能正常再更新

```
$ cordova --version
6.1.1
FISH-Air:QPlay faulfish$ cordova platform
Installed platforms:
  android 5.2.0
  ios 4.2.0
```

目錄結構
- /componentapp  …未來component Team主要開發測試用的APP,包括其他無法使用plugin的內建功能
- /plugins              …放置plugins的地方,包括其他無法使用www+css+js的內建功能
- /APP                  …放置APP的地方,包括使用www+css+js的UI功能
- /TemplateCordovaAPP …之後會廢除, 改由componentapp取代
- /qplayApi             …放置PHP API

## Android BUILD
1. 手動 sign apk，讓 build 出來的 apk 可以使用 adb install 安裝
2. https://developer.android.com/studio/publish/app-signing.html#signing-manually
3. adb  tool  C:\Users\user\AppData\Local\Android\sdk\platform-tools
4. keytool and jarsigner tool C:\Program Files\Java\jdk1.7.0_79\bin
 
## iOS BUILD
1. 登記該裝置的UUID - AD_HOC 才需要
2. 刪除舊的, 新增iOS AD_HOC Distribution Profile - 綁定裝置UUID和APP ID
4. xCode\Preferences\Accounts\...account\View Details... - 下載2.
5. 到下面目錄找到4. ~/Library/MobileDevice/Provisioning\ Profiles/
 - ex: /Users/faulfish/Library/MobileDevice/Provisioning\ Profiles/c9e92498-4bb1-4f60-8dd0-379eb7cb5c50.mobileprovision
6. 指定--codeSignIdentity	 --provisioningProfile https://cordova.apache.org/docs/en/latest/guide/platforms/ios/
 - $ cordova build ios --release --device --codeSignIdentity="iPhone Distribution" --provisioningProfile="c9e92498-4bb1-4f60-8dd0-379eb7cb5c50"
 - 或 $ cordova build ios --release --device --buildConfig=build.json
7. 附上2. 
![screen shot 2016-07-11 at 6 16 11 pm](https://cloud.githubusercontent.com/assets/1924451/16727899/f491260c-4795-11e6-91e1-db88dbc34fe8.png)
![screen shot 2016-07-11 at 6 18 27 pm](https://cloud.githubusercontent.com/assets/1924451/16727903/f7d0644a-4795-11e6-820d-9183f5910574.png)
![screen shot 2016-07-11 at 6 25 12 pm](https://cloud.githubusercontent.com/assets/1924451/16727917/051f7050-4796-11e6-9ef2-f1ccbf02d49f.png)
![screen shot 2016-07-11 at 6 24 36 pm](https://cloud.githubusercontent.com/assets/1924451/16727908/fcbbd534-4795-11e6-9641-a3a15c3667a0.png)
![screen shot 2016-07-11 at 6 24 48 pm](https://cloud.githubusercontent.com/assets/1924451/16727912/ffc915c0-4795-11e6-8e20-7e285c334fd5.png)


![Image of Yaktocat](https://cloud.githubusercontent.com/assets/1924451/15109396/ce744f80-160d-11e6-9558-92e85836c014.png)

Item A
-----------------------

### QRCode -> web view for provide install link -> iOS & APP store app for show app from item B

1. QRCode link
   - [x] `http://store.benq.com/Apps/Store/index.html`
2. index.html include following
   - [ ] `http://store.benq.com/Apps/Store/android/icon.png`
   - [x] `http://store.benq.com/Apps/Store/android/Store.ver1.apk`

Item B
-----------------------

### web viewe for deploy app -> upload apps to a web folder 

1. http://[domain]/Apps/[Name]/[ios|android]/[filename]
2. http://[domain]/Apps/[Name]/[ios|android]/icon.png
3. http://[domain]/Apps/[Name]/[ios|android]/descript.json

eg.

1. `http://store.benq.com/Apps/YellowPage/android/YellowPage.ver1.apk`
2. `http://store.benq.com/Apps/YellowPage/android/icon.png`
3. `http://store.benq.com/Apps/YellowPage/android/descript.json`

Item C
-----------------------

### IPC between store app and other apps
