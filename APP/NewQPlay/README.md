# Contents
- [isRegister](#isregister)
- [getAppList](#getapplist)
- [addAppLog](#addapplog)
- [getSecurityList](#getsecuritylist)

----
# isRegister

## 描述
移動裝置提供uuid給server確認是否已經認證過, 原則上一個移動裝置只需認證一次。

## Method
GET /v101/qplay/isRegister?lang=en-us

## Authentication
required

## Header Parameters
欄位名稱 | 是否必填 | 描述
------------ | ------------- | -------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )

此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e"

## Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------
uuid | Required | string | "設備的unique id <br>uuid: <br>android:設備上的ANDROID_ID <br>iOS:APNS所提供的DeviceTokenex: <br>apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br>android可能是9774d56d682e549c"

## Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
------------ | ------------- | ------------- | ------------- | -------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
is_register | content | 0-1 | Boolean | "1:true, 已經註冊<br>0:false, 未註冊"

P.S如果result_code為1, 則會帶content, 反之, 不帶content

## Example
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
# getAppList
取得有權限的App清單及Detail資訊

### 請求方法
GET /v101/qplay/getAppList?lang=en-us

### header請求參數
欄位名稱 | 是否必填 | 描述
------------ | ------------- | -------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 qplay
signature-time |必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
token | 必填 |由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密，加密時需要添加salt值，salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br>apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是 <br> 9774d56d682e549c

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------| -------------
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

----
# addAppLog
透過此接口, 讓APP可以將log送到後台, 供未來大數據分析

### 請求方法
POST /v101/qplay/addAppLog?lang=en-us

### header請求參數
欄位名稱 | 是否必填 | 描述
------------ | ------------- | -------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------
lang | Required | string | 請填入 語系-國家 <br> ex: <br> en-us <br> zh-tw <br> zh-cn
uuid | Optional | string |調用這支API的設備unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c

### POST Body
參數名稱 | 父節點 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | ------------- | -------------
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
------------ | ------------- | ------------- | ------------- | -------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container

P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example

----
# getSecurityList
通常在login成功後, 再透過token來取, 除了白名單外(也就是允許存許的URL), 還會提供security level資訊 <br> Block List則不在這支API上取得, 如果是在黑名單內, 會直接由API server reject回應在錯誤碼上, 錯誤碼為999009:禁止存取API


### 請求方法
GET /v101/qplay/getSecurityList?lang=en-us

### header請求參數
欄位名稱 | 是否必填 | 描述
------------ | ------------- | -------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) ) <br> 此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e
token | 必填 | 由server配發的token, 用來識別是否已經登入qplay <br> token值需要使用sha256加密, 加密時需要添加salt值, salt值為request header內的Signature-Time參數 <br> $token = base64_encode (hash_hmac(‘sha256’, $Signature-Time, $token’, true));

### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------
uuid | Required | string | 設備的unique id <br> uuid: <br> android:設備上的ANDROID_ID <br> iOS:APNS所提供的DeviceToken <br> ex: <br> apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br> android可能是9774d56d682e549c
app_key |Required | string | 請填入app的app_key <br> ex:qplay, phonebook

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
------------ | ------------- | ------------- | ------------- | -------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
token_valid | NA | 0-1 | Integer | 本次使用的token的有效時間 <br> 格式為Unix時間搓記 <br> 2016年3月25日 下午 01:49:56 換算為1458884996
content | NA | 0-1 | Container | 回應訊息內容Container
security_level | NA | 0-1 | Integer | 數字越少security越高 <br> 目前先定義三種 <br> 1:最高security, on_resume時必須重新輸入密碼 <br> 2:次級security, 關閉app重新開啟時才需要重新輸入密碼 <br> 3:一般security, 只要token沒有過期都不需要重新輸入密碼
allow_url | content | 0-N | String | 允許存取的url

P.S如果result_code為1, 則會帶content, 反之, 不帶content

### Example

