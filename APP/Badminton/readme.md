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

## 目錄結構

 - config.xml <= cordova 自動產生,但有時需要修改, 此範例無此必要
 - readme.md
 - /hooks/ <= cordova 自動產生,但有時需要修改, 此範例無此必要
 - /Images/ <= 所需的圖檔, Icon放這裡, 覆蓋project用,該目錄已作修改
 - /platforms_demo/ios/ <= cordova 自動產生ios project, 在此做說明用
 - /www/index.html <= app啟動點,該檔案已作修改
  ```
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">

        <link rel="stylesheet" type="text/css" href="css/jquery.mobile-1.4.5.min.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/APP-common.css">

        <script type="text/javascript" src="js/lib/jquery-1.12.3.min.js"></script>
        <script type="text/javascript" src="js/lib/jquery.mobile-1.4.5.min.js"></script>
        <script type="text/javascript" src="js/lib/pulltorefresh.js"></script>
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
        <script type="text/javascript" src="js/APP-common.js"></script>
        
        <title>Badminton</title>
    </head>
    <body>

    </body>
</html>
 ```
 - /www/js/index.js <= 包含要引進的頁面, 應包含一個以及一個以上, 此範例為兩個頁面, 該檔案已作修改
 ```
 var pageList = ["viewMain","viewGame"];
 ```
 - /www/js/app-common.js <= app啟動點,該檔案已作修改
 ```節錄
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        $.mobile.changePage('#viewMain');
    }
};

app.initialize();

/********************************** jQuery Mobile Event *************************************/
$(document).one("pagebeforecreate", function() {

    $(':mobile-pagecontainer').html("");

    //According to the data [pageList] which set in index.js ,
    //add Page JS into index.html
    $.map(pageList, function(value, key) {
        (function(pageID) {
            /*
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "js/" + pageID + ".js";
            $("head").append(s);
            */

            var script = document.createElement("script");
            // onload fires even when script fails loads with an error.
            //script.onload = onload;
            // onerror fires for malformed URLs.
            //script.onerror = onerror;
            script.type = "text/javascript";
            script.src = "js/" + pageID + ".js";
            document.head.appendChild(script);
        }(value));
    });

    //According to the data [pageList] which set in index.js ,
    //add View template into index.html
    $.map(pageList, function(value, key) {
        (function(pageID) {
            $.get("View/" + pageID + ".html", function(data) {
                $.mobile.pageContainer.append(data);
                $("#" + pageID).page().enhanceWithin();
            }, "html");
        }(value));
    });

});
```
- /www/View/viewMain.html <= 第一個頁面,該檔已作修改
```
<span id="tmp_option_width" class="hidden" style="font-size:2.8vh"></span>
<div data-role="page" id="viewMain">
    <div class="ios-fix-overlap-div"></div>
    <div data-role="header" data-position="fixed" class="page-header">
        <div id="container" class="header-style">
            <div id="center" class="ui-title">火哥羽球隊</div>
        </div>
    </div>
    <div data-role="main" class="page-main" style="line-height: initial !important;">
        <ul data-role="listview" data-ajax="false" data-inset="true" data-theme="a">
            <li><a href="#viewLogin">報到<span class="ui-li-count">22</span></a></li>
            <li><a href="#viewOption">場地<span class="ui-li-count">3</span></a></li>
            <li><a href="#viewRule">規則<span class="ui-li-count">手動</span></a></li>
            <li><a href="#viewGame">登錄比賽/成績<span class="ui-li-count">7</span></a></li>
        </ul>
    </div>
</div>
```
- /www/js/viewMain.js <= 第一個頁面,該檔案已作修改
```
$("#viewMain").pagecontainer({
    create: function(event, ui) {
        //page init
    }
});
```
- /www/View/viewGame.html <= 第二個頁面,該檔案已作修改
- /www/js/viewGame.js <= 第二個頁面,該檔案已作修改

## 啟動步驟
1. 確認裝好需要的平台, 此範例為iOS, 呼叫 cordova platform add ios
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
2. 呼叫 cordova run ios, 此範例是跑在模擬器上, 若要跑在實體機器上, 必須加入Apple開發團隊

![img_1121](https://cloud.githubusercontent.com/assets/1924451/25879530/bbf50076-3564-11e7-90d4-c6ee4a8f8b4f.PNG)
![img_1122](https://cloud.githubusercontent.com/assets/1924451/25879539/c2752bba-3564-11e7-943e-cb2a86175258.PNG)
![img_1123](https://cloud.githubusercontent.com/assets/1924451/25879536/bf6ba02a-3564-11e7-8ebf-7febb77feeb1.PNG)
