# EnterpriseAPPPlatform
=======================
A platform for enterprise app store, it include a web site, store app, and sample apps, both iOS and android
The MRS include Item A, B, C

Item A
-----------------------

### QRCode -> web view for provide install link -> iOS & APP store app for show app from item B

* QRCode link
1. eg. http://store.benq.com/Apps/Store/index.html
* index.html include following
1. eg. [link]http://store.benq.com/Apps/Store/android/icon.png
2. eg. http://store.benq.com/Apps/Store/android/Store.ver1.apk

Item B
-----------------------

### web viewe for deploy app -> upload apps to a web folder 

1. http://[domain]/Apps/[Name]/[ios|android]/[filename]
2. http://[domain]/Apps/[Name]/[ios|android]/icon.png
3. http://[domain]/Apps/[Name]/[ios|android]/descript.json

eg. http://store.benq.com/Apps/YellowPage/android/YellowPage.ver1.apk

Item C
-----------------------

### IPC between store app and other apps
