NewQPlay API Readme.md
=============================

## Version 1.2.18 - Published 2018 Feb 23

## Contents
- [API 分類](#API-分類)
- [QPlay APP 啟動程序](#QPlay-APP-啟動程序)
- [常用 API 說明](#常用-API-說明)
    - [isRegister](#isregister)
    - [getAppList](#getapplist)
    - [addAppLog](#addapplog)
    - [getSecurityList](#getsecuritylist)
    - [checkAppVersion](#checkappversion)
    - [sendPushToken](#sendpushtoken)
    - [getMessageList](#getmessagelist)
    - [getFunctionList](#getfunctionlist)
    - [getFunctionDetail](#getfunctiondetail)
    - [login](#login)


----
<h2 id="API-分類">API 分類</h2>

Register | Token | Security | APP/Function | Log | PUSH | Portal(HR)
:------------ | :------------- | :------------- | :------------- | :------------- | :------------- | :-------------
1.register <br> 2.isRegister | 1.renewToken <br> 2.login <br> 3.logout | 1.getSecurityList | 1.getAppList <br> 2.checkAppVersion <br> 3.getFunctionList <br> 4.getFunctionDetail | 1.addAppLog <br> 2.addDownloadHit | 1.sendPushToken <br> 2.updateMessage <br> 3.getMessageList <br> 4.getMessageDetail | 1.PortalList <br> 2.PortalListDetail


----
<h2 id="QPlay-APP-啟動程序">QPlay APP 啟動程序</h2>

![startup1](https://user-images.githubusercontent.com/18409964/39984909-45ca8d78-578f-11e8-81c2-413ab8d99895.png)

![startup2](https://user-images.githubusercontent.com/18409964/39984963-6eb36b2e-578f-11e8-9c3c-d32364df8810.png)
----
<h2 id="常用-API-說明">常用 API 說明</h2>

## *isRegister*

### 描述
```
移動裝置提供uuid給server確認是否已經認證過, 原則上一個移動裝置只需認證一次。
```

### Method
```
GET /v101/qplay/isRegister?lang=en-us
```

### Authentication
```
required
```

### Header Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )

    此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e"

### Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | "設備的unique id <br>uuid: <br>android:設備上的ANDROID_ID <br>iOS:APNS所提供的DeviceTokenex: <br>apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br>android可能是9774d56d682e549c"

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
is_register | content | 0-1 | Boolean | "1:true, 已經註冊<br>0:false, 未註冊"

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```PHP
            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    if(d.result_code == 1) {
                        if(d.content.is_register == 1) {
                            login(userName, password, company, uuid);
                        } else {
                            registerAndLogin(userName, password, company, uuid, device_type);
                        }
                    } else {
                        showMessage(d.message);
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessage(e);
                }
            });

```

----
## *getAppList*
```
取得有權限的App清單及Detail資訊
```

### 請求方法
```
GET /v101/qplay/getAppList?lang=en-us
```

### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 qplay
signature-time |必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
token | 必填 |由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密，加密時需要添加salt值，salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br>apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是 <br> 9774d56d682e549c

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------| :-------------
result_code |NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
app_category_list | content | 0-N | Container | app分類的Container
category_id | app_category_list | 0-1 | String | app分類的Unique流水號 <br> qp_app_category.row_id
app_category| app_category_list | 0-1 | String | app分類名稱
sequence | app_category_list | 0-1 | Integer | app分類排序
app_list | content | 0-N | Container | app清單的Container
app_id | app_list | 0-1 | String | APP在DB上的Unique流水號 <br> qp_app_head.row_id
app_code | app_list | 0-1 | String | APP專案代號
package_name | app_list | 0-1 | String | Package name
app_category_id | app_list | 0-1 | String | app編號的流水號
default_lang | app_list | 0-1 | String | app預設語系en-us
app_version | app_list | 0-1 | String | APP版號
app_version_name | app_list | 0-1 | String | APP版本名稱
security_level | app_list | 0-1 | String | 數字越少security越高 <br> 目前先定義三種 <br> 1:最高security, on_resume時必須重新輸入密碼 <br>2:次級security, 關閉app重新開啟時才需要重新輸入密碼 <br> 3:一般security, 只要token沒有過期都不需要重新輸入密碼
avg_score | app_list | 0-1 | String | APP評分
user_score | app_list | 0-1 | String | 這個User的個人評分
sequence | app_list | 0-1 | Integer | APP排序
url | app_list | 0-1 | String | Android/iOS版本下載URL
icon_url | app_list | 0-1 | String | Icon圖標下載URL
size | app_list | 0-1 | Integer | 檔案大小, 單位是Bytes
multi_lang| content | 0-N | Container | Container
app_code | multi_lang | 0-1 | String | APP專案代號
lang | multi_lang | 0-1 | String | 採用en-us這樣的格式 <br> Ex: <br> en-us <br> zh-tw <br> zh-cn
app_name | multi_lang | 0-1 | String | APP名稱
app_summary | multi_lang | 0-1 | String | APP短摘要
app_description | multi_lang | 0-1 | String |APP長描述
pic_list | multi_lang | 0-N | Container | Container
pic_type | pic_list | 0-1 | String |縮圖類別 <br> B:Banner <br> S:screenshot
pic_url | pic_list | 0-1 | String | Picture下載url
sequence | pic_list | 0-1 | Integer | Picture的排序

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
            var __construct = function() {

                var limitSeconds = 1 * 60 * 60 * 24;
                var QueryAppListData = JSON.parse(window.localStorage.getItem('QueryAppListData'));
                if (loginData["versionName"].indexOf("Staging") !== -1) {
                    limitSeconds = 1;
                } else if (loginData["versionName"].indexOf("Development") !== -1) {
                    limitSeconds = 1;
                }
                if (QueryAppListData === null || checkDataExpired(QueryAppListData['lastUpdateTime'], limitSeconds, 'ss')) {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                } else {
                    var responsecontent = JSON.parse(window.localStorage.getItem('QueryAppListData'))['content'];
                    FillAppList(responsecontent);
                }

            }();
```
----
## *addAppLog*
```
透過此接口, 讓APP可以將log送到後台, 供未來大數據分析
```

### 請求方法
```
POST /v101/qplay/addAppLog?lang=en-us
```

### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | 請填入 語系-國家 <br> ex: <br> en-us <br> zh-tw <br> zh-cn
uuid | Optional | string |調用這支API的設備unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c

### POST Body
參數名稱 | 父節點 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
login_id | NA | Required | string | 登入者的AD帳號
package_name | NA | Required | string | 填入APP的app package name
log_list | NA | Required | Container | 底下包一組以上的陣列
page_name | log_list | Optional | string | 請填入APP端自行定義的畫面名稱, 對Server端沒有意義 <br>由APP自行定義每支APP對應每個頁面的naming rule及其背後的涵義
page_action | log_list | Optional | string | 請填入APP端自行定義的畫面名稱, 對Server端沒有意義 <br> 由APP自行定義每支APP對應每個頁面裡的每個動作的naming rule及其背後的涵義
start_time | log_list | Optional | int | 請提供unix時間搓記, <br> 單位到秒 <br> ex: 2016年3月25日 下午 01:49:56 換算為1458884996
period | log_list | Optional | float | 每個動作或是每個畫面停留的時間 <br> 如果說page_action定義出來的欄位意義代表著次數, 那period欄位也可以不填
device_type | log_list | Required | string | ios/android
latitude | log_list | Optional | string | GPS的緯度座標
longitude | log_list | Optional | string | GPS的經度座標
county | log_list | Optional | string | 發送所在國家, 非必填
city | log_list | Optional | string | 發送所在城市, 非必填
attribute1 | log_list | Optional | string | 其他訊息 <br> APP端自行定義
attribute2 | log_list | Optional | string | 其他訊息 <br> APP端自行定義
attribute3 | log_list | Optional | string | 其他訊息 <br> APP端自行定義
attribute4 | log_list | Optional | string | 其他訊息 <br> APP端自行定義
attribute5 | log_list | Optional | string | 其他訊息 <br> APP端自行定義

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
function getAddAppLog() {

    var self = this;
    var appLogData = JSON.parse(localStorage.getItem('appLogData'));
    var queryData = JSON.stringify(appLogData);

    this.successCallback = function(data) {

        var resultcode = data['result_code'];
        var logDataLength = appLogData.log_list.length;
        if (resultcode == 1) {
            for (var i = 0; i < logDataLength; i++) {
                appLogData.log_list.shift();
            }
            localStorage.setItem('appLogData', JSON.stringify(appLogData));
        }
    }

    this.failCallback = function(data) {};

    var __construct = function() {
        loginData["versionName"] = AppVersion.version;
        //if (loginData["versionName"].indexOf("Development") !== -1 || loginData["versionName"].indexOf("Staging") !== -1) {
        QPlayAPIEx("POST", "addAppLog", self.successCallback, self.failCallback, queryData, "", "low", 1000);
        //}
    }();

}
```
----
## *getSecurityList*
```
通常在login成功後, 再透過token來取, 除了白名單外(也就是允許存許的URL), 還會提供security level資訊
Block List則不在這支API上取得, 如果是在黑名單內, 會直接由API server reject回應在錯誤碼上, 錯誤碼為999009:禁止存取API
```

### 請求方法
```
GET /v101/qplay/getSecurityList?lang=en-us
```

### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
token | 必填 | 由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密, 加密時需要添加salt值, salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c
app_key |Required | string | 請填入app的app_key <br> ex:qplay, phonebook

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
security_level | NA | 0-1 | Integer | 數字越少security越高 <br> 目前先定義三種 <br> 1:最高security, on_resume時必須重新輸入密碼 <br> 2:次級security, 關閉app重新開啟時才需要重新輸入密碼 <br> 3:一般security, 只要token沒有過期都不需要重新輸入密碼
allow_url | content | 0-N | String | 允許存取的url

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
function getSecurityList() {

    var self = this;
    var queryStr = "&app_key=" + appKey;

    this.successCallback = function(data) {
        doInitialSuccess = true;
        checkTokenValid(data['result_code'], data['token_valid'], null, null);
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("GET", "getSecurityList", self.successCallback, self.failCallback, null, queryStr);
    }();

}
```
----
## *checkAppVersion*
```
取得APP最新版號資訊, 並由Server主動確認是否需要更新
```

### 請求方法
```
GET /v101/qplay/checkAppVersion?lang=en-us&package_name=com.qplay.appqplay&device_type=android&version_code=1
```
### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
package_name | Required | string | app的package name
device_type | Required | string | ios <br> android <br> 其中一個
vension_code | Required | string | 填入目前版號

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼 <br> resul_code=1, 表示需要更新 <br> result_code =000913, 表示不需要更新
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
version_code | content | 0-1 | String | 新版本版號
download_url | content | 0-1 | String | 直接提供iOS或是Android的下載路徑 <br>下載的路經需偵測詢問的路徑, 如果是qplay.benq.com/….. <br> 則回應的下載網址為https://qplay.benq.com/.... <br> 如果下的API路徑為10.82.121.4/… <br> 則回應的下載網址為https://10.82.121.4/....

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
function checkAppVersion() {
    var self = this;
    var queryStr = "&package_name=com.qplay." + appKey + "&device_type=" + device.platform + "&version_code=" + loginData["versionCode"];

    loadingMask("show");

    this.successCallback = function(data) {
    ...
    ...
    ...
    }

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPIEx("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr, "high", 30000);
    }();
}
```
----
## *sendPushToken*
```
採用Jpush極光推送機制
所以手機需要向Jpush Server註冊後, 發送RegisterID給Qplay server
```

### 請求方法
```
GET /v101/qplay/sendPushToken?lang=en-us
```

### header請求參數
```
sendPushToken時, 需要將push-token欄位透過HTTP Header送出, 所以包含下面參數：
```

欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
push-token | 必填 | 傳送向極光SERVER獲取的RegisterID

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c
app_key | Required | string | 如果是qplay平台用的, 就傳qplay <br> 假設是e04也許就會傳phonebook這個值
device_type | Required | string | iOS或是Android <br> 提供server辨識該向APNS或是GCM發送推播

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
uuid | NA | 0-1 | String | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c <br> 成功的話, 會傳送此次交易的uuid供double check

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
function sendPushToken() {
    var self = this;
    var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType;

    this.successCallback = function() {};

    this.failCallback = function() {};

    var __construct = function() {
        if (loginData.token !== null && loginData.token.length !== 0) {
            QPlayAPI("POST", "sendPushToken", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}
```

----
## *getMessageList*
```
取得Message清單, 將user未刪除過的訊息提供在Qplay app上
```

### 請求方法
```
GET /v101/qplay/getMessageList?lang=en-us
```

### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
token | 必填 | 由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密, 加密時需要添加salt值, salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c
date_from | Optional | Integer | 填入取得訊息的起始時間 <br> 不填則由SERVER直接抓取上次存取的時間搓, 抓差異化的訊息提供出去 <br> 有填date_from就一定要填上date_to
date_to | Optional | Integer | 填入取得訊息的結束時間 <br> 不填則由SERVER直接抓”當前”的時間搓 <br> 有填date_to就一定要填date_from
count_from | Optional | Integer | 如果有下date_time, date_to, 則這個欄位才有作用, 可以下載指定數量的訊息 <br> 沒有下參數, 則抓時間區間內所有資料
count_to | Optional | Integer | 如果有下date_time, date_to, 則這個欄位才有作用, 可以下載指定數量的訊息 <br> 沒有下參數, 則抓時間區間內所有資料
overwrite_timestamp | Optional | Integer | 如果有下date_time, date_to, 則這個欄位才有作用 <br> 如果是1, 則代表要更新獲取訊息的時間搓記 <br> 會更新qp_register裡面的last_message_time <br> 如果是0, 代表不更新不時間搓記 <br> 不會更新qp_register裡面的last_message_time <br> 如果不提供這個參數, 代表是0

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String |回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
message_count | content | 0-1 | Integer | 此次查詢的訊息總數量
message_list | content | 0-N | Container | 訊息列表container, 有多個訊息
message_row_id | message_list | 0-1 | Integer | 訊息unique id
message_send_row_id | message_list | 0-1 | Integer | 訊息send的unique id
message_type | message_list | 0-1 | String | 訊息類別, 目前分類: <br> news <br> event
message_title | message_list | 0-1 | String | 訊息標題
message_txt | message_list | 0-1 | String | 訊息純文字格式
message_html | message_list | 0-1 | String | 訊息html格式
message_url | message_list | 0-1 | String | 訊息網址, 如果是空白, 表示該訊息沒有網址可以查看
read | message_list | 0-1 | Boolean | 是否已經看過該訊息 <br> 只有event類別會有這個flag, news類別不會傳送此欄位
message_source | message_list | 0-1 | String | 訊息是從哪個平台傳遞過來 <br> 目前平台未定義 <br> 現階段:qplay
read_time | message_list | 0-1 | String | 查看訊息時間
create_user | message_list | 0-1 | String | 訊息發布者 
create_time | message_list | 0-1 | Integer | 訊息發布時間 <br> 直接抓qp_user_message或qp_role_message裡面的create_time
source_user | content | 0-1 | String | 這筆推播是誰送出來

    P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example
```JS
        window.QueryMessageList = function(action) {
            //review by alan
            callGetMessageList = true;

            action = action || null;

            var self = this;
            var queryStr = "";
            var msgDateTo = getTimestamp();
            ...
            ...
            ...
            this.failCallback = function(data) {
                callGetMessageList = false;
            };

            var __construct = function() {
                QPlayAPI("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
            }();
        }
```

----
## *login*
```
登入qplay, 取得token
```

### 請求方法
```
GET /v101/qplay/login?lang=en-us
```

### header請求參數
    login需要將帳號密碼欄位透過HTTP Header送出, 所以包含下面參數：
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
domain | 必填 | AD domain
loginid | 必填 | AD login id
password | 必填 | AD login password
redirect_uri | 必填 | app提供的轉址URI, 待qplay auth web頁面呼叫login api取回token後, 需要轉址回這個頁面

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
redirect_uri | content | 1 | String | app提供的轉址URI, 待qplay auth web頁面呼叫login api取回token後, 需要轉址回這個頁面 <br> 若取得token失敗, 也會透過這個URI轉址將錯誤訊息帶回給app
content | NA | 0-1 | Container | 回應訊息內容Container
uuid | content | 0-1 | String | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c
token | content | 0-1 | String | 由server配發的token, 用來識別是否已經登入qplay, 時效為48hours
loginid | content | 0-1 | String | 員工AD帳號 <br> ex:steven.yan
emp_no | content | 0-1 | String | 員工工號
domain | content | 0-1 | String | 員工所屬domain <br> ex:Qgroup, BenQ
site_code | content | 0-1 | String | 員工所屬地區 <br> ex:QTY,QTT,QCS
checksum | content | 0-1 | String | 將密碼欄位用md5加密後當作checksum
security_update_list | NA | 0-1 | Container | 回應訊息內容Container
app_key | security_update_list | 0-N | String | 兩個月內有異動security_level的app
security_updated_at | security_update_list | 0-N | Integer | 這個欄位表示security level的最後更新時間, 採用Unix時間搓記 <br> ex: 2016年3月25日 下午 01:49:56 換算為1458884996

```
備註1:
因為security_level的異動機率不高
所以一旦有異動
就把異動的app的package name也拋出來
但是只拋出兩個月內的異動清單
異動處如下的紅字

備註2:
如果result_code為1, 則會帶content, 反之, 不帶content
```

### Example
```PHP
            $.ajax({
                url: "v101/qplay/login?lang="+lang+"&uuid=" +uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key",appKey);
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", domain);
                    request.setRequestHeader("loginid", loginId);
                    request.setRequestHeader("password", password);
                },
                success: function (d, status, xhr) {
                    HideLoading();
                    if(d.result_code && d.result_code == 1) {
                        saveLoginInfo(loginId, domain);
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"site_code" : "' + d.content.site_code + '",'
                                + '"checksum" : "' + d.content.checksum + '",'
                                + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                        callPlugin();
                    } else {
                        showMessage(d.result_code + ": " + d.message,"Y");
                    }
                },
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    if($.trim(e.responseText) == '' && e.statusText == 'error'){
                        showMessage("MSG_NETWORK_ERROR");
                        return;
                    }
                    showMessage(thrownError,"Y");
                }
            });

```

----
## *getFunctionList*
```
取得此 APP 底下的所有 Function，並且回傳各個 Function 的使用權限，如果是 Function Type = APP，另外告知 APP 的 packageName 和 Icon URL。
```

### 請求方法
```
GET /v101/qplay/getFunctionList?lang=en-us
```

### header請求參數
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 qplay
signature-time |必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為 swexuc453refebraXecujeruBraqAc4e
token | 必填 | 由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密, 加密時需要添加salt值, salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));
loginid | 必填 | AD login id
ad_flag | 否 | 是否屬於 QAccount User <br> (之後 API Login 回傳的資料會包含 ad_flag，到時候在傳入此資料)

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
function_list | content | 0-1 | Container | Function列表container, 有多個 Function
function_variable | function_list | 0-1 | String | Function Variable
function_content | function_list | 0-1 | Container | 單一個 Function 的資料內容 Container
right | function_content | 0-1 | String | Function的使用權限 : <br> Y : 有權限 <br> N : 沒有權限
type | function_content | 0-1 | String | Function 類別 : <br> FUN : Function <br> APP : Application
package_name | function_content | 0-1 | String | APP 的 package name。<br>當 type = APP，才會有此資料。
icon | function_content | 0-1 | String | APP 的Icon URL。<br>當 type = APP，才會有此資料。

```
Check Poit:
1.	Header 預設的資料 ad_flag，初期不用帶入，每次使用 loginid 至 `qp_user` 取得。
2.	承上， 之後 API Login 會修改回傳的資料內容，會包含 ad_flag，在由 APP 端帶入 ad_flag，不需要再透過 `qp_user` 取得。
3.	初期，如果不需要回傳 APP List Data，可以不需要使用 `qp_app_head`。
```

### Example
?????? <br>
?????? <br>
??????

----

## *getFunctionDetail*

```
取得此 Function的詳細資料，只有當 Function Type = APP 的時候，需要使用此 API。
```

### 請求方法
```
GET /v101/qplay/getFunctionDetail?lang=en-us&package_name=com.qplay.appqplay&device_type=android
```

### header請求參數

欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 qplay
signature-time |必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為 swexuc453refebraXecujeruBraqAc4e
token | 必填 | 由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密, 加密時需要添加salt值, salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));    
    
### 網址列請求參數： 

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
package_name | Required | string | app的package name
device_type | Required | string | ios <br> android <br> 其中一個

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
app_id | content | 1 | String | APP Unique ID
app_name | content | 1 | String | APP 名稱
app_summary | content | 1 | String | APP 短摘要
app_description | content | 1 | String | APP 長描述
default_lang | content | 1 | String | APP 的預設語系
security_level | content | 1 | String | APP 的安全等級
sequence | content | 1 | Integer | APP 排序
icon_url | content | 1 | String | Icon 圖標下載 URL
app_version | content | 1 | String | APP 版號
app_version_name | content | 1 | String | APP 版本名稱
app_version_log | content | 1 | String | APP 更版說明
ur | content | 1 | String | Android/iOS 版本下載URL
size | content  1 | Integer | 檔案大小，單位 Bytes
pic_list | content | 1 | Container | Container
pic_url | pic_list | 0-1 | String | Picture 下載 URL

### Example
?????? <br>
?????? <br>
??????

----
