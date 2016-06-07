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

http://moduscreate.com/writing-a-cordova-plugin-in-swift-for-ios/
這個網站提供

1. plugin 建立的方法
2. plugin 使用自己建立的plugin
3. plugin 支援 iOS swift 的方法

目錄結構
- /componentapp  …未來component Team主要開發測試用的APP,包括其他無法使用plugin的內建功能
- /plugins              …放置plugins的地方,包括其他無法使用www+css+js的內建功能
- /APP                  …放置APP的地方,包括使用www+css+js的UI功能
- /TemplateCordovaAPP …之後會廢除, 改由componentapp取代

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
