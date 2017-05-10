# 建立一個範本, 便於學習如何使用cordova撰寫APP
#### 該範本可以單獨使用, 不需要QPlay, Gulp, Plugin支援
#### 目的是為了進入QPlay APP開發建立基礎條件
#### 滿足該課程後, 繼續學習Plugin的使用->Gulp的基本原理->QPlay Component->QPlay API
#### 使用該範例, 必須先安裝好Cordova
1. 安裝完成Cordova https://cordova.apache.org/#getstarted
2. 確認方式, 下command line,  cordova requirements, 會出現下面資訊
```
alan:Badminton alan$ cordova requirements

Requirements check results for ios:
Apple OS X: installed darwin
Xcode: installed 8.3.2
ios-deploy: installed 2.0.0
CocoaPods: installed 

alan:Badminton alan$
```

## 主要目的有下列幾點

1. 如何建立一個Cordova APP
2. 如何建立一個View
3. 如何切換不同View
4. 如何在模擬器上操作Debug
5. 如何使用JQueryMobile開發GUI

此範例以listview示範
http://demos.jquerymobile.com/1.4.5/listview/

啟動步驟
1. 確認裝好需要的平台, 此範例為iOS
```
alan:Badminton alan$ cordova platform
Installed platforms:
  ios 4.3.1
Available platforms: 
  amazon-fireos ~3.6.3 (deprecated)
  android ~6.1.1
  blackberry10 ~3.8.0
  browser ~4.1.0
  firefoxos ~3.6.3
  osx ~4.0.1
  webos ~3.7.0
alan:Badminton alan$
```
2. 呼叫 cordova run ios

