# EnterpriseAPPPlatform
=======================
A platform for enterprise app store, it include a web site, store app, and sample apps, both iOS and android
The MRS include Item A, B, C

Domain knowledge
 - http://demos.jquerymobile.com/1.4.5/
 - http://www.owlcarousel.owlgraphic.com
 - http://cordova.apache.org
 - http://huangxuan.me/js-module-7day/#/
 - http://blog.csdn.net/enlyhua/article/category/5022771

Requirements check results for android:
 - Java JDK: installed .
 - Android SDK: installed 
 - Android target: installed android-23
 - Gradle: installed 

Requirements check results for ios:
 - Apple OS X: installed darwin
 - Xcode: installed 7.3
 - ios-deploy: installed 2.0.0

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
