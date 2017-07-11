![image001](https://cloud.githubusercontent.com/assets/1924451/20743151/9735df36-b70f-11e6-95d0-dd794b2d60bd.png)

# 企業運作平台
## 讓開發安全可靠好用的APP變得很容易

使用WEB為主要開發環境, 只要你會寫網頁, 就可以開發APP

###  安裝

![qplayinstall](https://cloud.githubusercontent.com/assets/1924451/18819378/6873332c-83c2-11e6-892f-db70c5257f4d.png)

### 開發完成的Plugin
1. [qsecurity-plugin](https://github.com/BenQdigiPages/EnterpriseAPPPlatform/wiki/qsecurity-plugin)
2. [qlogin-plugin](https://github.com/BenQdigiPages/EnterpriseAPPPlatform/wiki/qlogin-plugin)
3. [qpush-plugin](https://github.com/BenQdigiPages/EnterpriseAPPPlatform/issues/14)

目前運行版本, 更新的版本為驗證過, 請確認所有功能正常再更新

```
$ cordova --version
6.5.0
FISH-Air:QPlay faulfish$ cordova platform
Installed platforms:
android 6.0.0
ios 4.3.1
FISH-Air:QPlay faulfish$ cordova plugins
cordova-plugin-appavailability 0.4.2 "AppAvailability"
cordova-plugin-appversion 1.0.0 "App Version"
cordova-plugin-console 1.0.5 "Console"
cordova-plugin-customurlscheme 4.2.0 "Custom URL scheme"
cordova-plugin-device 1.1.5 "Device"
cordova-plugin-inappbrowser 1.6.1 "InAppBrowser"
cordova-plugin-qlogin 1.0.0 "QLoginPlugin"
cordova-plugin-qpush 1.0.0 "QPush Plugin"
cordova-plugin-qsecurity 1.0.0 "QSecurityPlugin"
cordova-plugin-whitelist 1.3.1 "Whitelist"
```

目錄結構

Folder | Description
------------ | -------------
API                   | 放置APP API, QPLay團隊自行開發的APP API
APP                   | 放置APP的地方,包括使用www+css+js的UI功能
componentapp          | 未來component Team主要開發測試用的APP,包括其他無法使用plugin的內建功能
Dailybuild            | 放置CI的地方,Dailybuild
plugins               | 放置plugins的地方,包括其他無法使用www+css+js的內建功能
qmessage              | 放置qmessage API
qplay                 | 放置PHP Platform
qplayApi              | 放置PHP API
WEB                   | 放置WEB Page的地方,Login, Download, Install...

Requirements check results for android:
 - Requirements check results for android:
 - Java JDK: installed 1.8.0
 - Android SDK: installed true
 - Android target: installed android-23,android-24,android-25
 - Gradle: installed 

Requirements check results for ios:
 - Requirements check results for ios:
 - Apple OS X: installed darwin
 - Xcode: installed 8.2.1
 - ios-deploy: installed 1.9.0
 - CocoaPods: not installed 
 - CocoaPods was not found. Please install version 1.0.1 or greater from https://cocoapods.org/

Third-party Library:
 - jquery-1.12.3.min.js https://jquery.com
 - jquery.mobile-1.4.5.min.js https://jquerymobile.com
 - slick.min.js http://kenwheeler.github.io/slick/
 - highcharts.js https://www.highcharts.com
 - jtsage-datebox-4.1.1.jqm.js http://dev.jtsage.com/jQM-DateBox/
 - jmessage-sdk-web-2.1.0.min.js https://docs.jiguang.cn/jmessage/guideline/jmessage_guide/
 - pullrefresh.js https://www.boxfactura.com/pulltorefresh.js/

![sa2 - system archiecture](https://cloud.githubusercontent.com/assets/1924451/24186815/026d322e-0f15-11e7-9407-ee799456cba9.png)

