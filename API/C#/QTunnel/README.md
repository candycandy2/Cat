QTunnel API Readme.md
=============================

## Version 1.2.18 - Published 2018 Feb 23

## Contents
- [API 分類](#API-分類)
- [常用 API 說明](#常用-API-說明)
    - [login](#login)


----
<h2 id="API-分類">API 分類</h2>

Login | 
:------------ | 
1.login <br> 2.logout | 

----
<h2 id="常用-API-說明">常用 API 說明</h2>


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
