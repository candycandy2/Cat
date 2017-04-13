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
6.1.1
FISH-Air:QPlay faulfish$ cordova platform
Installed platforms:
  android 5.2.0
  ios 4.2.0
FISH-Air:QPlay faulfish$ cordova plugins
cordova-connectivity-monitor 1.2.2 "Connectivity Monitoring"
cordova-plugin-dialogs 1.2.1 "Notification"
cordova-plugin-network-information 1.2.1 "Network Information"
cordova-plugin-qsecurity 1.0.0 "QSecurityPlugin"
cordova-plugin-splashscreen 3.2.2 "Splashscreen"
cordova-plugin-statusbar 2.1.3 "StatusBar"
```

目錄結構
- /API                  …放置APP API, QPLay團隊自行開發的APP API
- /APP                  …放置APP的地方,包括使用www+css+js的UI功能
- /componentapp         …未來component Team主要開發測試用的APP,包括其他無法使用plugin的內建功能
- /Dailybuild           …放置CI的地方,Dailybuild
- /plugins              …放置plugins的地方,包括其他無法使用www+css+js的內建功能
- /qmessage             …放置qmessage API
- /qplay                …放置PHP Platform
- /qplayApi             …放置PHP API
- /WEB                  …放置WEB的地方,Login, Download...

Requirements check results for android:
 - Java JDK: installed .
 - Android SDK: installed 
 - Android target: installed android-23
 - Gradle: installed 

Requirements check results for ios:
 - Apple OS X: installed darwin
 - Xcode: installed 7.3
 - ios-deploy: installed 2.0.0

Third-party Library:
 - jquery-1.12.3.min.js https://jquery.com
 - jquery.mobile-1.4.5.min.js https://jquerymobile.com
 - slick.min.js http://kenwheeler.github.io/slick/
 - highcharts.js https://www.highcharts.com

![sa2 - system archiecture](https://cloud.githubusercontent.com/assets/1924451/24186815/026d322e-0f15-11e7-9407-ee799456cba9.png)

